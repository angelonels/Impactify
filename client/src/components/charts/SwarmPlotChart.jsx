import { ResponsiveSwarmPlot } from '@nivo/swarmplot';
import { commonTheme } from './theme';
import { inferColumnRoles, toGroupedValueShape } from '../../lib/chartShape';

export default function SwarmPlotChart({ data, groupKey, valueKey }) {
    const roles = inferColumnRoles(data);
    const gk = groupKey || roles.categorical[0];
    const vk = valueKey || roles.numeric[0];
    const shape = toGroupedValueShape(data, { groupKey: gk, valueKey: vk });

    return (
        <ResponsiveSwarmPlot
            data={shape}
            groups={[...new Set(shape.map((d) => d.group))]}
            identity="value"
            value="value"
            valueScale={{ type: 'linear' }}
            theme={commonTheme}
            margin={{ top: 30, right: 100, bottom: 60, left: 60 }}
            size={8}
            colors={{ scheme: 'category10' }}
            axisBottom={{ tickRotation: -30, legend: gk, legendOffset: 40, legendPosition: 'middle' }}
            axisLeft={{ legend: vk, legendOffset: -45, legendPosition: 'middle' }}
        />
    );
}
