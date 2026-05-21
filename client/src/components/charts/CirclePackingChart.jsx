import { ResponsiveCirclePacking } from '@nivo/circle-packing';
import { commonTheme } from './theme';
import { inferColumnRoles, toHierarchyShape } from '../../lib/chartShape';

export default function CirclePackingChart({ data, categoryKey, valueKey }) {
    const roles = inferColumnRoles(data);
    const ck = categoryKey || roles.categorical[0];
    const vk = valueKey || roles.numeric[0];
    const root = toHierarchyShape(data, { categoryKey: ck, valueKey: vk });

    return (
        <ResponsiveCirclePacking
            data={root}
            id="name"
            value="value"
            theme={commonTheme}
            colors={{ scheme: 'category10' }}
            padding={4}
            enableLabels
            labelTextColor="#fff"
            labelsSkipRadius={20}
        />
    );
}
