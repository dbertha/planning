import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Planning } from './components/Planning';
import { ToastProvider } from './components/Toast';
import { CalendarModalProvider } from './contexts/CalendarModalContext';
import './App.css';

function App() {
  return (
    <CalendarModalProvider>
      <ToastProvider>
        <DndProvider backend={HTML5Backend}>
          <Planning />
        </DndProvider>
      </ToastProvider>
    </CalendarModalProvider>
  );
}

export default App; 