import React, { useState, useEffect } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';
import fetchWorldwideHolidays from '../utils/fetchHolidays';
import styled from '@emotion/styled';
import { Holiday } from '../interfaces/Holiday';

interface CalendarProps {
  onDayClick: (date: string) => void;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #e5e5e5;
`;

const DayCell = styled.div`
  min-height: 100px; 
  background-color: #fff; 
  border: 1px solid #e5e5e5; 
  padding: 8px;
  cursor: pointer;
`;

const HolidayName = styled.div`
  margin-top: auto;
  background-color: #f0f0f0;
  padding: 2px 5px;
  font-size: 0.8em;
`;

const Calendar: React.FC<CalendarProps> = ({ onDayClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  useEffect(() => {
    const currentYear = currentMonth.getFullYear();
    fetchWorldwideHolidays(currentYear).then(setHolidays);
  }, [currentMonth]);

  const startDay = startOfWeek(startOfMonth(currentMonth));
  const endDay = endOfWeek(endOfMonth(currentMonth));
  const monthDays = eachDayOfInterval({ start: startDay, end: endDay });

  return (
    <Grid>
      {monthDays.map((day, index) => {
        const formattedDate = format(day, 'yyyy-MM-dd');
        const holiday = holidays.find(holiday => holiday.date === formattedDate);

        const isDecember27 = formattedDate.endsWith('-12-27');
        const holidayText = isDecember27 ? holiday?.localName : holiday?.name;

        return (
          <DayCell key={index} onClick={() => onDayClick(formattedDate)}>
            <div>{day.getDate()}</div>
            {holiday && <HolidayName>{holidayText}</HolidayName>}
          </DayCell>
        );
      })}
    </Grid>
  );
};

export default Calendar;
