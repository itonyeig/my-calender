import React, { useState, useEffect, createContext, useContext } from 'react';
import Calendar from './components/Calendar';
import TaskModal from './components/TaskModal';
import { Task } from './interfaces/Task';
import { generateUniqueId } from './utils/helper';
import { LabelProvider } from './contexts/LabelProvider';


const TaskContext = createContext<{
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}>({} as any);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within a TaskProvider');
  return context;
};

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadedFromStorage, setIsLoadedFromStorage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    setIsLoadedFromStorage(true);
  }, []);
  
  useEffect(() => {
    if (isLoadedFromStorage) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoadedFromStorage]);

  const handleDayClick = (date: string) => {
    const newTask = { id: '', title: '', description: '', labelIds: [], date: date };
    setSelectedTask(newTask);
    setIsModalOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (enteredTask: Task) => {
    if (enteredTask.id) {
      setTasks(currentTasks => currentTasks.map(task => task.id === enteredTask.id ? { ...task, ...enteredTask } : task));
    } else {
      const newTask = { ...enteredTask, id: generateUniqueId() };
      setTasks(currentTasks => [...currentTasks, newTask]);
    }
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <LabelProvider>
      <TaskContext.Provider value={{ tasks, setTasks }}>
        <Calendar 
          onDayClick={handleDayClick} 
          tasks={tasks} 
          onTaskClick={handleTaskClick}
          setTasks={setTasks}

        />
        {isModalOpen && (
          <TaskModal
            task={selectedTask}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveTask}
          />
        )}
    </TaskContext.Provider>
    </LabelProvider>
  
  );
};

export default App;
