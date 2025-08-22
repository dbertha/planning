import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Planning } from './components/Planning';
import './App.css';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Planning />
    </DndProvider>
  );
}

export default App; 