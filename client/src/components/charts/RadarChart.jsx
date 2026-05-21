import { ResponsiveRadar } from '@nivo/radar';
import { commonTheme } from './theme';
import { inferColumnRoles } from '../../lib/chartShape';

export default function RadarChart({ data, indexBy, keys }) {
    const roles = inferColumnRoles(data);
    const idx = indexBy || roles.categorical[0];
    const k = keys && keys.length > 0 ? keys : roles.numeric.slice(0, 6);
    if (!idx || k.length < 3) {
        return <p style={{ color: '#aaa' }}>Radar needs 1 category + at least 3 numeric columns.</p>;
    }
    return (
        <ResponsiveRadar
            data={data}
            keys={k}
            indexBy={idx}
            theme={commonTheme}
            margin={{ top: 60, right: 80, bottom: 60, left: 80 }}
            colors={{ scheme: 'category10' }}
            borderWidth={2}
            gridLabelOffset={16}
            dotSize={8}
            dotColor={{ from: 'color' }}
            dotBorderWidth={2}
            motionConfig="wobbly"
            legends={[
                {
                    anchor: 'top-left',
                    direction: 'column',
                    translateX: -50,
                    translateY: -40,
                    itemWidth: 80,
                    itemHeight: 20,
                    itemTextColor: '#ddd',
                    symbolSize: 12,
                    symbolShape: 'circle',
                },
            ]}
        />
    );
}
