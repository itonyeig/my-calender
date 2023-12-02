// src/App.tsx
import React, { useState, useEffect, createContext, useContext } from 'react';
import Calendar from './components/Calendar';
import TaskModal from './components/TaskModal';
import { Task } from './interfaces/Task';

// Create a context for tasks
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

  // Load tasks from local storage when the component mounts
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to local storage when they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleSaveTask = (task: Task) => {
    setTasks(currentTasks => {
      // If the task already has an ID, we are editing an existing task
      if (task.id) {
        // Update existing task
        return currentTasks.map(t => t.id === task.id ? { ...t, ...task } : t);
      } else {
        // Create new task with a unique ID
        const newTask = {
          ...task,
          id: crypto.getRandomValues(new Uint32Array(1))[0].toString(16) // Generate a random ID
        };
        return [...currentTasks, newTask];
      }
    });
    setIsModalOpen(false);
  };
  

  return (
    <TaskContext.Provider value={{ tasks, setTasks }}>
      <Calendar />
      <TaskModal
        task={null} // Pass null for new task creation
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
      />
      {/* Add a button or method to open the modal for new task creation */}
    </TaskContext.Provider>
  );
};

export default App;
