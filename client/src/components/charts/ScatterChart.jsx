import { ResponsiveScatterPlot } from '@nivo/scatterplot';
import { commonTheme } from './theme';
import { inferColumnRoles, toScatterShape } from '../../lib/chartShape';

export default function ScatterChart({ data, xKey, yKey, groupKey }) {
    const roles = inferColumnRoles(data);
    const x = xKey || roles.numeric[0];
    const y = yKey || roles.numeric[1] || roles.numeric[0];
    const grp = groupKey || (roles.categorical.length > 0 ? roles.categorical[0] : null);
    const shape = toScatterShape(data, { xKey: x, yKey: y, groupKey: grp });

    return (
        <ResponsiveScatterPlot
            data={shape}
            theme={commonTheme}
            margin={{ top: 30, right: 130, bottom: 50, left: 60 }}
            xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            blendMode="multiply"
            axisBottom={{ tickRotation: -30, legend: x, legendOffset: 40, legendPosition: 'middle' }}
            axisLeft={{ legend: y, legendOffset: -45, legendPosition: 'middle' }}
            nodeSize={8}
            useMesh
            legends={[
                {
                    anchor: 'right',
                    direction: 'column',
                    translateX: 120,
                    itemWidth: 100,
                    itemHeight: 18,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    itemTextColor: '#ddd',
                },
            ]}
        />
    );
}
