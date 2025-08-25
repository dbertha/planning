import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Planning } from './components/Planning';
import { ToastProvider } from './components/Toast';
import './App.css';

function App() {
  return (
    <ToastProvider>
      <DndProvider backend={HTML5Backend}>
        <Planning />
      </DndProvider>
    </ToastProvider>
  );
}

export default App; 