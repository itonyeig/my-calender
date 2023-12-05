import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, addYears, subYears } from 'date-fns';
import fetchWorldwideHolidays from '../utils/fetchHolidays';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';
import { Holiday } from '../interfaces/Holiday';
import { Task } from '../interfaces/Task';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { LabelCreationModal } from './LabelCreationModal';
import { useLabels } from '../contexts/LabelContext';
import { generateUniqueId } from '../utils/helper';

const LabelContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
`;

const LabelTag = styled.span<{ color: string, dynamicWidth?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: ${({ dynamicWidth }) => dynamicWidth || '6.25rem'};
  padding: 2px 6px;
  border-radius: 12px;
  background-color: ${({ color }) => color};
  color: #fff;
  margin-bottom: 4px;
  flex: 1;
  max-width: 100%;
`;

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

const TaskItem = styled.div<TaskItemProps & { labelIds: string[] }>`
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

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 1rem;
  background-color: #f3f3f3;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  button, input[type='text'], .dropdown-button {
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
    margin-right: 0.5rem;
  }

  button {
    background-color: #FFC436;
    color: white;
    border: none;
    padding: 0 1rem;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background-color: #E9B824;
    }
  }

  input[type='text'] {
    width: 25%;
    padding: 0 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .dropdown-button {
    padding: 10px;
    cursor: pointer;
  }
`;

const CommonButton = styled.button`
  height: 40px;
  line-height: 40px;
  background-color: #FFC436;
  color: white;
  border: none;
  padding: 0 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
  box-sizing: border-box;
  margin-bottom: 10px;f

  &:hover {
    background-color: #E9B824;
  }

  &:last-child {
    margin-right: 0;
  }
`;





const DropdownButton = styled.button`
  padding: 10px;
  margin-bottom: 10px;
  cursor: pointer;
`;

const Dropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownContent = styled.div`
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border-radius: 4px;
  display: none;
  left: 50%;
  transform: translateX(-50%);

  &.show {
    display: block;
  }

  div {
    padding: 10px;
    text-align: center;
    cursor: pointer;

    &:hover {
      background-color: #E9B824;
    }
  }
`;

const CheckboxLabel = styled.label`
  display: block;
  padding: 10px;
  cursor: pointer;
  text-align: center;
  border-radius: 4px; 

  &:hover {
    background-color: #E9B824;
  }
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
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const { labels } = useLabels();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const monthDropdownRef = useRef<HTMLInputElement>(null);
  const yearDropdownRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef(null);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = Array.from({ length: 21 }, (_, index) => new Date().getFullYear() - 10 + index);

  useEffect(() => {
    const currentYear = currentMonth.getFullYear();
    fetchWorldwideHolidays(currentYear).then(setHolidays);
  }, [currentMonth]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
       if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
      setShowMonthDropdown(false);
    }
        if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
          setShowYearDropdown(false);
        }
  
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const startDay = startOfWeek(startOfMonth(currentMonth));
  const endDay = endOfWeek(endOfMonth(currentMonth));
  const monthDays = eachDayOfInterval({ start: startDay, end: endDay });

  const handleMonthChange = (monthIndex: number) => {
    const newDate = new Date(currentMonth.setMonth(monthIndex));
    setCurrentMonth(newDate);
    setShowMonthDropdown(false);
  };

  const isDayInCurrentMonth = (day: Date) => {
    return currentMonth.getMonth() === day.getMonth();
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(currentMonth.setFullYear(year));
    setCurrentMonth(newDate);
    setShowYearDropdown(false);
    fetchWorldwideHolidays(year).then(setHolidays);
  };


  const handleDownloadImage = async () => {
    const calendarElement = calendarRef.current;
    console.log('i was clicked inside', calendarElement)
    if (calendarElement) {
      const canvas = await html2canvas(calendarElement);
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'calendar.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  

  const handleLabelFilterChange = (labelId: string) => {
    setSelectedLabels(prev => {
      if (prev.includes(labelId)) {
        return prev.filter(id => id !== labelId);
      } else {
        return [...prev, labelId];
      }
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };  

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLabels = selectedLabels.length === 0 || task.labelIds.some(id => selectedLabels.includes(id));
    return matchesSearch && matchesLabels;
  });


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

  const handleExport = () => {
    
    const dataStr = JSON.stringify(tasks);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileName = 'calendar-data.json';
  
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = event.target.files?.[0]; 

    console.log('file ', file);
    
    if (file) {
      fileReader.readAsText(file, "UTF-8");
      fileReader.onload = e => {
        const content = e.target?.result;
        
        if (typeof content === 'string') { 
          try {
            const data: Task[] = JSON.parse(content);
            const importedData = data.map(task => ({...task, id: generateUniqueId()}))
            console.log('imported tasks ', importedData)
            setTasks(currentTasks => [...currentTasks, ...importedData]);
          } catch (error) {
            console.error('Error importing data: ', error);
          }
        }
      };
    }
  };
  
  

  return (
    <>
      <Global 
       styles={css`
       body {
         margin: 0;
         padding: 0;
         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
           'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
           sans-serif;
         -webkit-font-smoothing: antialiased;
         -moz-osx-font-smoothing: grayscale;
       }

       #root {
         padding: 20px;
       }
     `}
      />
      <HeaderContainer>
        <SearchBar
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Dropdown ref={monthDropdownRef}>
          <DropdownButton onClick={() => setShowMonthDropdown(!showMonthDropdown)}>
            {format(currentMonth, "MMMM")}
          </DropdownButton>
          {showMonthDropdown && (
            <DropdownContent className="show">
              {months.map((month, index) => (
                <div key={month} onClick={() => handleMonthChange(index)}>{month}</div>
              ))}
            </DropdownContent>
          )}
        </Dropdown>

        <Dropdown ref={yearDropdownRef}>
          <DropdownButton onClick={() => setShowYearDropdown(!showYearDropdown)}>
            {format(currentMonth, "yyyy")}
          </DropdownButton>
          {showYearDropdown && (
            <DropdownContent className="show">
              {years.map(year => (
                <div key={year} onClick={() => handleYearChange(year)}>{year}</div>
              ))}
            </DropdownContent>
          )}
        </Dropdown>
        <CommonButton onClick={() => setIsLabelModalOpen(true)}>Create Label</CommonButton>
        <Dropdown ref={dropdownRef}>
        <DropdownButton onClick={() => setShowDropdown(!showDropdown)}>Filter by Labels</DropdownButton>
        {showDropdown && (
          <DropdownContent className="show">
            {labels.map(label => (
          <CheckboxLabel key={label.id}>
            <input
              type="checkbox"
              checked={selectedLabels.includes(label.id)}
              onChange={() => handleLabelFilterChange(label.id)}
            />
            {label.name}
          </CheckboxLabel>
        ))}
          </DropdownContent>
        )}
      </Dropdown>
      <CommonButton onClick={handleExport}>Export Calendar</CommonButton>
      <input
        type="file"
        onChange={handleImport}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
      <CommonButton onClick={() => fileInputRef.current?.click()}>
        Import Calendar
      </CommonButton>
      <CommonButton onClick={handleDownloadImage}>Download Calendar as Image</CommonButton>
      </HeaderContainer>
       {/* Label Management Modal */}
       {isLabelModalOpen && (
        <LabelCreationModal onClose={() => setIsLabelModalOpen(false)} />
      )}
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <Grid ref={calendarRef}>
          {monthDays.map((day, dayIndex) => {
            const dayInCurrentMonth = isDayInCurrentMonth(day);
            const formattedDate = format(day, 'yyyy-MM-dd');
            const dayTasks = filteredTasks.filter(task => task.date === formattedDate);
            const holiday = holidays.find(holiday => holiday.date === formattedDate);
            const holidayText = holiday ? (formattedDate.endsWith('-12-27') ? holiday.localName : holiday.name) : null;

            return (
              <Droppable droppableId={formattedDate} key={dayIndex}>
                {(provided) => (
                  <DayCell 
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    onClick={() => !isDragging && onDayClick(formattedDate)}
                    style={
                      !dayInCurrentMonth
                        ? {
                            backgroundColor: '#f0f0f0',
                            color: '#d3d3d3'
                          }
                        : {}
                    }
                  >
                    <div>{day.getDate()}</div>
                    {holiday && <HolidayName>{holidayText}</HolidayName>}
                    {dayTasks.map((task, taskIndex) => (
                      <Draggable key={task.id} draggableId={task.id} index={taskIndex}>
                        {(dragProvided, snapshot) => (
                          <TaskItem
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            isDragging={snapshot.isDragging}
                            labelIds={task.labelIds} 
                            onClick={(e) => {
                              if (!snapshot.isDragging) {
                                e.stopPropagation();
                                onTaskClick(task);
                              }
                            }}
                          >
                            {/* Label tags and task title */}
                            <LabelContainer>
                            {task.labelIds.map((labelId, index, array) => {
                              const label = labels.find((label) => label.id === labelId);
                              const containerWidth = 100;
                              const totalSpacing = (array.length * 10) + ((array.length - 1) * 10);
                              const availableWidth = containerWidth - totalSpacing;
                              const dynamicWidth = availableWidth / array.length;
                              return label ? (
                                <LabelTag 
                                  key={label.id} 
                                  color={label.color} 
                                  dynamicWidth={`${dynamicWidth}px`}>
                                </LabelTag>
                              ) : null;
                            })}
                          </LabelContainer>
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