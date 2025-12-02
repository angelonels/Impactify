import { ResponsiveLine } from '@nivo/line';
import { commonTheme } from './theme';

const LineChart = ({ data, xKey, yKey }) => {

    const formattedData = [
        {
            id: yKey,
            color: "hsl(205, 70%, 50%)",
            data: data.map(d => ({
                x: d[xKey],
                y: d[yKey]
            }))
        }
    ];

    return (
        <ResponsiveLine
            data={formattedData}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
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
                legendPosition: 'middle'
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