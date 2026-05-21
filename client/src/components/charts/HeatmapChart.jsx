import { ResponsiveHeatMap } from '@nivo/heatmap';
import { commonTheme } from './theme';
import { inferColumnRoles, toHeatmapShape } from '../../lib/chartShape';

export default function HeatmapChart({ data, rowKey, colKey, valueKey }) {
    const roles = inferColumnRoles(data);
    const rk = rowKey || roles.categorical[0];
    const ck = colKey || roles.categorical[1] || roles.categorical[0];
    const vk = valueKey || roles.numeric[0];
    const shape = toHeatmapShape(data, { rowKey: rk, colKey: ck, valueKey: vk });

    return (
        <ResponsiveHeatMap
            data={shape}
            theme={commonTheme}
            margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
            axisTop={{ tickRotation: -30, legend: ck, legendOffset: -40, legendPosition: 'middle' }}
            axisLeft={{ legend: rk, legendOffset: -70, legendPosition: 'middle' }}
            colors={{ type: 'sequential', scheme: 'blues' }}
            emptyColor="#222"
            borderColor="#333"
            labelTextColor="#fff"
        />
    );
}
