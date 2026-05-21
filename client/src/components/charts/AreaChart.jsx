import { ResponsiveLine } from '@nivo/line';
import { commonTheme } from './theme';

const looksLikeDate = (v) => {
    if (v instanceof Date) return true;
    if (typeof v !== 'string') return false;
    return !Number.isNaN(Date.parse(v));
};

export default function AreaChart({ data, xKey, yKey }) {
    const isTemporal = data.length > 0 && looksLikeDate(data[0][xKey]);
    const sorted = isTemporal
        ? [...data].sort((a, b) => new Date(a[xKey]) - new Date(b[xKey]))
        : data;
    const series = [{
        id: yKey,
        data: sorted.map((d) => ({
            x: isTemporal ? new Date(d[xKey]) : d[xKey],
            y: d[yKey],
        })),
    }];
    const xScale = isTemporal
        ? { type: 'time', format: 'native', precision: 'day' }
        : { type: 'point' };

    return (
        <ResponsiveLine
            data={series}
            theme={commonTheme}
            margin={{ top: 40, right: 80, bottom: 50, left: 60 }}
            xScale={xScale}
            yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            xFormat={isTemporal ? 'time:%Y-%m-%d' : undefined}
            enableArea
            areaOpacity={0.35}
            curve="monotoneX"
            colors={{ scheme: 'category10' }}
            pointSize={6}
            useMesh
            axisBottom={{
                tickRotation: -30,
                legend: xKey,
                legendOffset: 40,
                legendPosition: 'middle',
                format: isTemporal ? '%b %Y' : undefined,
            }}
            axisLeft={{ legend: yKey, legendOffset: -45, legendPosition: 'middle' }}
        />
    );
}
