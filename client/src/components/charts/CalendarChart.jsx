import { ResponsiveCalendar } from '@nivo/calendar';
import { commonTheme } from './theme';
import { inferColumnRoles, toCalendarShape } from '../../lib/chartShape';

export default function CalendarChart({ data, dayKey, valueKey }) {
    const roles = inferColumnRoles(data);
    const dk = dayKey || roles.temporal[0] || roles.categorical[0];
    const vk = valueKey || roles.numeric[0];
    const shape = toCalendarShape(data, { dayKey: dk, valueKey: vk });
    if (shape.length === 0) return <p style={{ color: '#aaa' }}>No date column detected.</p>;

    const from = shape[0].day;
    const to = shape[shape.length - 1].day;
    return (
        <ResponsiveCalendar
            data={shape}
            from={from}
            to={to}
            theme={commonTheme}
            emptyColor="#1a1a1a"
            colors={['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe']}
            margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
            yearSpacing={40}
            monthBorderColor="#333"
            dayBorderColor="#0a0a0a"
        />
    );
}
