import { ResponsiveLine } from '@nivo/line';
import { commonTheme } from './theme';

const looksLikeDate = (v) => {
    if (v instanceof Date) return true;
    if (typeof v !== 'string') return false;
    const t = Date.parse(v);
    return !Number.isNaN(t);
};

const LineChart = ({ data, xKey, yKey }) => {
    const isTemporal = data.length > 0 && looksLikeDate(data[0][xKey]);

    const sorted = isTemporal
        ? [...data].sort((a, b) => new Date(a[xKey]) - new Date(b[xKey]))
        : data;

    const formattedData = [
        {
            id: yKey,
            color: "hsl(205, 70%, 50%)",
            data: sorted.map(d => ({
                x: isTemporal ? new Date(d[xKey]) : d[xKey],
                y: d[yKey]
            }))
        }
    ];

    const xScale = isTemporal
        ? { type: 'time', format: 'native', precision: 'day' }
        : { type: 'point' };

    return (
        <ResponsiveLine
            data={formattedData}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={xScale}
            xFormat={isTemporal ? 'time:%Y-%m-%d' : undefined}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
            yFormat=" >-.2f"
            theme={commonTheme}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: xKey,
                legendOffset: 36,
                legendPosition: 'middle',
                format: isTemporal ? '%b %Y' : undefined,
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: yKey,
                legendOffset: -40,
                legendPosition: 'middle'
            }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [{ on: 'hover', style: { itemOpacity: 1 } }]
                }
            ]}
        />
    );
};

export default LineChart;