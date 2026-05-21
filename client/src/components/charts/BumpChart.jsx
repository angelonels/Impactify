import { ResponsiveBump } from '@nivo/bump';
import { commonTheme } from './theme';
import { inferColumnRoles, toBumpShape } from '../../lib/chartShape';

export default function BumpChart({ data, xKey, seriesKey, valueKey }) {
    const roles = inferColumnRoles(data);
    const xk = xKey || roles.temporal[0] || roles.categorical[0];
    const sk = seriesKey || roles.categorical.find((c) => c !== xk);
    const vk = valueKey || roles.numeric[0];
    if (!xk || !sk || !vk) return <p style={{ color: '#aaa' }}>Bump needs an x-axis, a series, and a value column.</p>;
    const shape = toBumpShape(data, { xKey: xk, seriesKey: sk, valueKey: vk });

    return (
        <ResponsiveBump
            data={shape}
            theme={commonTheme}
            margin={{ top: 30, right: 100, bottom: 50, left: 60 }}
            colors={{ scheme: 'category10' }}
            lineWidth={3}
            activeLineWidth={5}
            inactiveLineWidth={2}
            inactiveOpacity={0.4}
            pointSize={10}
            activePointSize={14}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serie.color' }}
            axisTop={null}
            axisBottom={{ tickRotation: -30 }}
        />
    );
}
