import { ResponsiveBoxPlot } from '@nivo/boxplot';
import { commonTheme } from './theme';
import { inferColumnRoles, toGroupedValueShape } from '../../lib/chartShape';

export default function BoxPlotChart({ data, groupKey, valueKey }) {
    const roles = inferColumnRoles(data);
    const gk = groupKey || roles.categorical[0];
    const vk = valueKey || roles.numeric[0];
    const shape = toGroupedValueShape(data, { groupKey: gk, valueKey: vk });

    return (
        <ResponsiveBoxPlot
            data={shape}
            theme={commonTheme}
            margin={{ top: 30, right: 100, bottom: 60, left: 60 }}
            padding={0.12}
            axisBottom={{ tickRotation: -30, legend: gk, legendOffset: 40, legendPosition: 'middle' }}
            axisLeft={{ legend: vk, legendOffset: -45, legendPosition: 'middle' }}
            colors={{ scheme: 'category10' }}
            borderColor="#333"
        />
    );
}
