import { ResponsiveFunnel } from '@nivo/funnel';
import { commonTheme } from './theme';
import { inferColumnRoles, toFunnelShape } from '../../lib/chartShape';

export default function FunnelChart({ data, categoryKey, valueKey }) {
    const roles = inferColumnRoles(data);
    const ck = categoryKey || roles.categorical[0];
    const vk = valueKey || roles.numeric[0];
    const shape = toFunnelShape(data, { categoryKey: ck, valueKey: vk });

    return (
        <ResponsiveFunnel
            data={shape}
            theme={commonTheme}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            direction="vertical"
            colors={{ scheme: 'spectral' }}
            borderWidth={20}
            labelColor="#fff"
            beforeSeparatorLength={50}
            beforeSeparatorOffset={10}
            afterSeparatorLength={50}
            afterSeparatorOffset={10}
            currentPartSizeExtension={10}
            currentBorderWidth={40}
            motionConfig="gentle"
        />
    );
}
