import { ResponsiveTreeMap } from '@nivo/treemap';
import { commonTheme } from './theme';
import { inferColumnRoles, toHierarchyShape } from '../../lib/chartShape';

export default function TreemapChart({ data, categoryKey, valueKey }) {
    const roles = inferColumnRoles(data);
    const ck = categoryKey || roles.categorical[0];
    const vk = valueKey || roles.numeric[0];
    const root = toHierarchyShape(data, { categoryKey: ck, valueKey: vk, rootName: ck || 'root' });

    return (
        <ResponsiveTreeMap
            data={root}
            identity="name"
            value="value"
            theme={commonTheme}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            labelSkipSize={12}
            labelTextColor="#fff"
            colors={{ scheme: 'category10' }}
            borderColor="#222"
        />
    );
}
