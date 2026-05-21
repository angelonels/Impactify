import BarChart from './BarChart';
import LineChart from './LineChart';
import PieChart from './PieChart';
import TableChart from './TableChart';
import AreaChart from './AreaChart';
import ScatterChart from './ScatterChart';
import HeatmapChart from './HeatmapChart';
import TreemapChart from './TreemapChart';
import SunburstChart from './SunburstChart';
import CirclePackingChart from './CirclePackingChart';
import FunnelChart from './FunnelChart';
import CalendarChart from './CalendarChart';
import RadarChart from './RadarChart';
import RadialBarChart from './RadialBarChart';
import WaffleChart from './WaffleChart';
import BoxPlotChart from './BoxPlotChart';
import SwarmPlotChart from './SwarmPlotChart';
import StreamChart from './StreamChart';
import BumpChart from './BumpChart';
import MarimekkoChart from './MarimekkoChart';
import KpiCard from './KpiCard';

/**
 * Each entry: { component, label, group, requires: (roles) => boolean }
 * `requires` is used by the override switcher to disable charts that
 * cannot render for the current data shape.
 */
export const chartRegistry = {
    bar:           { component: BarChart,           label: 'Bar',           group: 'comparison',   requires: (r) => r.categorical.length >= 1 && r.numeric.length >= 1 },
    line:          { component: LineChart,          label: 'Line',          group: 'time',         requires: (r) => (r.temporal.length >= 1 || r.categorical.length >= 1) && r.numeric.length >= 1 },
    area:          { component: AreaChart,          label: 'Area',          group: 'time',         requires: (r) => (r.temporal.length >= 1 || r.categorical.length >= 1) && r.numeric.length >= 1 },
    pie:           { component: PieChart,           label: 'Pie',           group: 'part-to-whole',requires: (r) => r.categorical.length >= 1 && r.numeric.length >= 1 },
    donut:         { component: PieChart,           label: 'Donut',         group: 'part-to-whole',requires: (r) => r.categorical.length >= 1 && r.numeric.length >= 1 },
    table:         { component: TableChart,         label: 'Table',         group: 'tabular',      requires: () => true },
    scatter:       { component: ScatterChart,       label: 'Scatter',       group: 'distribution', requires: (r) => r.numeric.length >= 2 },
    heatmap:       { component: HeatmapChart,       label: 'Heatmap',       group: 'comparison',   requires: (r) => r.categorical.length >= 2 && r.numeric.length >= 1 },
    treemap:       { component: TreemapChart,       label: 'Treemap',       group: 'part-to-whole',requires: (r) => r.categorical.length >= 1 && r.numeric.length >= 1 },
    sunburst:      { component: SunburstChart,      label: 'Sunburst',      group: 'part-to-whole',requires: (r) => r.categorical.length >= 1 && r.numeric.length >= 1 },
    'circle-packing': { component: CirclePackingChart, label: 'Circle pack', group: 'part-to-whole', requires: (r) => r.categorical.length >= 1 && r.numeric.length >= 1 },
    funnel:        { component: FunnelChart,        label: 'Funnel',        group: 'comparison',   requires: (r) => r.categorical.length >= 1 && r.numeric.length >= 1 },
    calendar:      { component: CalendarChart,      label: 'Calendar',      group: 'time',         requires: (r) => r.temporal.length >= 1 && r.numeric.length >= 1 },
    radar:         { component: RadarChart,         label: 'Radar',         group: 'comparison',   requires: (r) => r.categorical.length >= 1 && r.numeric.length >= 3 },
    'radial-bar':  { component: RadialBarChart,     label: 'Radial bar',    group: 'comparison',   requires: (r) => r.categorical.length >= 1 && r.numeric.length >= 1 },
    waffle:        { component: WaffleChart,        label: 'Waffle',        group: 'part-to-whole',requires: (r) => r.categorical.length >= 1 && r.numeric.length >= 1 },
    boxplot:       { component: BoxPlotChart,       label: 'Box plot',      group: 'distribution', requires: (r) => r.categorical.length >= 1 && r.numeric.length >= 1 },
    swarmplot:     { component: SwarmPlotChart,     label: 'Swarm',         group: 'distribution', requires: (r) => r.categorical.length >= 1 && r.numeric.length >= 1 },
    stream:        { component: StreamChart,        label: 'Stream',        group: 'time',         requires: (r) => r.numeric.length >= 2 },
    bump:          { component: BumpChart,          label: 'Bump',          group: 'time',         requires: (r) => (r.temporal.length >= 1 || r.categorical.length >= 2) && r.numeric.length >= 1 },
    marimekko:     { component: MarimekkoChart,     label: 'Marimekko',     group: 'comparison',   requires: (r) => r.categorical.length >= 1 && r.numeric.length >= 2 },
    kpi:           { component: KpiCard,            label: 'KPI',           group: 'glanceable',   requires: (r) => r.numeric.length >= 1 },
};

export const chartGroups = {
    comparison:    'Comparison',
    'time':        'Time series',
    'part-to-whole': 'Part-to-whole',
    distribution:  'Distribution',
    glanceable:    'Single value',
    tabular:       'Tabular',
};

export const getChart = (type) => chartRegistry[type] || chartRegistry.table;
export const allChartTypes = () => Object.keys(chartRegistry);
