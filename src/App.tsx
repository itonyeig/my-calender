import React, { useState, useEffect, createContext, useContext } from 'react';
import Calendar from './components/Calendar';
import TaskModal from './components/TaskModal';
import { Task } from './interfaces/Task';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleDayClick = (date: string) => {
    console.log("Day clicked:", date); // Add this to check if the function is called
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleSaveTask = (task: Task) => {
    setTasks(currentTasks => {
      if (task.id) {
        return currentTasks.map(t => t.id === task.id ? { ...t, ...task } : t);
      } else {
        const newTask = {
          ...task,
          id: crypto.getRandomValues(new Uint32Array(1))[0].toString(16)
        };
        return [...currentTasks, newTask];
      }
    });
    setIsModalOpen(false);
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks }}>
      <Calendar onDayClick={handleDayClick} />
      {isModalOpen && (
        <TaskModal
          task={{ id: '', title: '', description: '', labels: [], date: selectedDate }}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
        />
      )}
    </TaskContext.Provider>
  );
};

export default App;
