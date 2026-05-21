import { ResponsiveStream } from '@nivo/stream';
import { commonTheme } from './theme';
import { inferColumnRoles, toStreamShape } from '../../lib/chartShape';

export default function StreamChart({ data, numericKeys }) {
    const roles = inferColumnRoles(data);
    const k = numericKeys && numericKeys.length > 0 ? numericKeys : roles.numeric;
    if (k.length < 2) return <p style={{ color: '#aaa' }}>Stream needs at least 2 numeric series.</p>;
    const shape = toStreamShape(data, { numericKeys: k });

    return (
        <ResponsiveStream
            data={shape}
            keys={k}
            theme={commonTheme}
            margin={{ top: 30, right: 110, bottom: 50, left: 60 }}
            offsetType="silhouette"
            colors={{ scheme: 'category10' }}
            curve="basis"
            borderColor={{ theme: 'background' }}
            axisBottom={{ tickRotation: -30 }}
            legends={[
                {
                    anchor: 'right',
                    direction: 'column',
                    translateX: 100,
                    itemWidth: 80,
                    itemHeight: 18,
                    itemTextColor: '#ddd',
                    symbolShape: 'square',
                },
            ]}
        />
    );
}
