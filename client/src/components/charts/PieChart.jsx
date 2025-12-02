import { ResponsivePie } from '@nivo/pie';
import { commonTheme } from './theme';

const PieChart = ({ data, idKey, valueKey }) => {

    const formattedData = data.map(d => ({
        id: d[idKey],
        label: d[idKey],
        value: d[valueKey]
    }));

    return (
        <ResponsivePie
            data={formattedData}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            theme={commonTheme}
            colors={{ scheme: 'category10' }}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#ffffff"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
            legends={[
                {
                    anchor: 'bottom',
                    direction: 'row',
                    justify: false,
                    translateX: 0,
                    translateY: 56,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: '#999',
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: 'circle',
                    effects: [{ on: 'hover', style: { itemTextColor: '#FFF' } }]
                }
            ]}
        />
    );
};

export default PieChart;