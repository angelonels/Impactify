import { ResponsiveRadialBar } from '@nivo/radial-bar';
import { commonTheme } from './theme';
import { inferColumnRoles, toRadialBarShape } from '../../lib/chartShape';

export default function RadialBarChart({ data, categoryKey, valueKey }) {
    const roles = inferColumnRoles(data);
    const ck = categoryKey || roles.categorical[0];
    const vk = valueKey || roles.numeric[0];
    const shape = toRadialBarShape(data, { categoryKey: ck, valueKey: vk });

    return (
        <ResponsiveRadialBar
            data={shape}
            theme={commonTheme}
            margin={{ top: 40, right: 120, bottom: 40, left: 40 }}
            valueFormat=">-.2f"
            padding={0.4}
            cornerRadius={2}
            colors={{ scheme: 'category10' }}
            tracksColor="#222"
            radialAxisStart={{ tickSize: 5, tickPadding: 5 }}
            circularAxisOuter={{ tickSize: 5, tickPadding: 12 }}
            legends={[
                {
                    anchor: 'right',
                    direction: 'column',
                    translateX: 100,
                    itemWidth: 80,
                    itemHeight: 18,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    itemTextColor: '#ddd',
                },
            ]}
        />
    );
}
