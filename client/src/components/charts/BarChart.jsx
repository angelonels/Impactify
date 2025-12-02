import { ResponsiveBar } from '@nivo/bar';
import { commonTheme } from './theme';

const BarChart = ({ data, keys, indexBy }) => (
    <ResponsiveBar
        data={data}
        keys={keys}
        indexBy={indexBy}
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        theme={commonTheme}
        colors={{ scheme: 'category10' }}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45, // Angled text for better fit
            legend: indexBy,
            legendPosition: 'middle',
            legendOffset: 40
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: keys[0],
            legendPosition: 'middle',
            legendOffset: -50
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [{ on: 'hover', style: { itemOpacity: 1 } }]
            }
        ]}
        role="application"
        ariaLabel="Bar chart"
    />
);

export default BarChart;