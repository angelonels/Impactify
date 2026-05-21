import { ResponsiveMarimekko } from '@nivo/marimekko';
import { commonTheme } from './theme';
import { inferColumnRoles } from '../../lib/chartShape';

export default function MarimekkoChart({ data, idKey, valueKey, dimensions }) {
    const roles = inferColumnRoles(data);
    const id = idKey || roles.categorical[0];
    const value = valueKey || roles.numeric[0];
    const dims = (dimensions && dimensions.length > 0)
        ? dimensions
        : roles.numeric.slice(1).map((k) => ({ id: k, value: k }));

    if (dims.length === 0) return <p style={{ color: '#aaa' }}>Marimekko needs at least 2 numeric columns.</p>;

    return (
        <ResponsiveMarimekko
            data={data}
            id={id}
            value={value}
            dimensions={dims}
            theme={commonTheme}
            margin={{ top: 40, right: 80, bottom: 60, left: 80 }}
            colors={{ scheme: 'category10' }}
            borderColor="#222"
            axisBottom={{ tickRotation: -30 }}
        />
    );
}
