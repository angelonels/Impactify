import { ResponsiveWaffle } from '@nivo/waffle';
import { commonTheme } from './theme';
import { inferColumnRoles, toWaffleShape } from '../../lib/chartShape';

export default function WaffleChart({ data, categoryKey, valueKey }) {
    const roles = inferColumnRoles(data);
    const ck = categoryKey || roles.categorical[0];
    const vk = valueKey || roles.numeric[0];
    const { data: shape, total } = toWaffleShape(data, { categoryKey: ck, valueKey: vk });
    if (total === 0) return <p style={{ color: '#aaa' }}>Need positive numeric values.</p>;

    return (
        <ResponsiveWaffle
            data={shape}
            total={total}
            rows={10}
            columns={10}
            theme={commonTheme}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            colors={{ scheme: 'category10' }}
            borderColor="#0a0a0a"
            legends={[
                {
                    anchor: 'bottom',
                    direction: 'row',
                    translateY: 40,
                    itemWidth: 100,
                    itemHeight: 18,
                    symbolSize: 14,
                    itemTextColor: '#ddd',
                },
            ]}
        />
    );
}
