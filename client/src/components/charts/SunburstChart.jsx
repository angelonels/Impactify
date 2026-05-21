import { ResponsiveSunburst } from '@nivo/sunburst';
import { commonTheme } from './theme';
import { inferColumnRoles, toHierarchyShape } from '../../lib/chartShape';

export default function SunburstChart({ data, categoryKey, valueKey }) {
    const roles = inferColumnRoles(data);
    const ck = categoryKey || roles.categorical[0];
    const vk = valueKey || roles.numeric[0];
    const root = toHierarchyShape(data, { categoryKey: ck, valueKey: vk });

    return (
        <ResponsiveSunburst
            data={root}
            id="name"
            value="value"
            theme={commonTheme}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            cornerRadius={2}
            borderColor="#222"
            colors={{ scheme: 'category10' }}
            enableArcLabels
            arcLabelsTextColor="#fff"
        />
    );
}
