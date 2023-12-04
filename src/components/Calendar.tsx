import React, { useState, useEffect } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';
import fetchWorldwideHolidays from '../utils/fetchHolidays';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';
import { Holiday } from '../interfaces/Holiday';
import { Task } from '../interfaces/Task';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

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
  &:hover {
    background-color: #f2f2f2;
  }
`;

const HolidayName = styled.div`
  margin-top: auto;
  background-color: #f0f0f0;
  padding: 2px 5px;
  font-size: 0.8em;
`;

const TaskItem = styled.div<TaskItemProps>`
  margin-top: 4px;
  padding: 4px;
  background-color: #e0e0e0;
  border-radius: 4px;
  box-shadow: ${({ isDragging }) => (isDragging ? "0px 0px 10px #888888" : "none")};
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

interface TaskItemProps {
  isDragging: boolean;
}

interface CalendarProps {
  onDayClick: (date: string) => void;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const Calendar: React.FC<CalendarProps> = ({ onDayClick, tasks, onTaskClick, setTasks }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    const currentYear = currentMonth.getFullYear();
    fetchWorldwideHolidays(currentYear).then(setHolidays);
  }, [currentMonth]);

  const startDay = startOfWeek(startOfMonth(currentMonth));
  const endDay = endOfWeek(endOfMonth(currentMonth));
  const monthDays = eachDayOfInterval({ start: startDay, end: endDay });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };  

  const filteredTasks = searchQuery.length === 0 
  ? tasks 
  : tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const onDragEnd = (result: DropResult) => {
    setIsDragging(false);
    const { source, destination } = result;
  
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }
  
    const taskBeingDragged = tasks.find(task => task.id === result.draggableId);
    if (!taskBeingDragged) {
      return;
    }
  
    taskBeingDragged.date = destination.droppableId;
  
    const newTasks = tasks.filter(task => task.id !== taskBeingDragged.id);
    newTasks.splice(destination.index, 0, taskBeingDragged);
    setTasks(newTasks);
  };

  const onDragStart = () => {
    setIsDragging(true);
  };

  return (
    <>
      <Global 
        styles={css`
          body {
            cursor: ${isDragging ? "grabbing" : "default"};
          }
        `}
      />
      <SearchBar 
        type="text" 
        placeholder="Search tasks..." 
        value={searchQuery}
        onChange={handleSearchChange} 
      />
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <Grid>
          {monthDays.map((day, dayIndex) => {
            const formattedDate = format(day, 'yyyy-MM-dd');
            const dayTasks = filteredTasks.filter(task => task.date === formattedDate);
            const holiday = holidays.find(holiday => holiday.date === formattedDate);
            const isDecember27 = formattedDate.endsWith('-12-27');
            const holidayText = isDecember27 ? holiday?.localName : holiday?.name;

            return (
              <Droppable droppableId={formattedDate} key={dayIndex}>
                {(provided) => (
                  <DayCell 
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    onClick={() => !isDragging && onDayClick(formattedDate)}
                  >
                    <div>{day.getDate()}</div>
                    {holiday && <HolidayName>{holidayText}</HolidayName>}
                    {dayTasks.map((task, taskIndex) => (
                      <Draggable key={task.id} draggableId={task.id} index={taskIndex}>
                        {(provided, snapshot) => (
                          <TaskItem 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            isDragging={snapshot.isDragging}
                            onClick={(e) => {
                              if (!snapshot.isDragging) {
                                e.stopPropagation();
                                onTaskClick(task);
                              }
                            }}
                          >
                            {task.title}
                          </TaskItem>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </DayCell>
                )}
              </Droppable>
            );
          })}
        </Grid>
      </DragDropContext>
    </>
  );
};


export default Calendar;
