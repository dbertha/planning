import React, { createContext, useContext, useState } from 'react';
import { CalendarModal } from '../components/CalendarModal';

const CalendarModalContext = createContext();

export function CalendarModalProvider({ children }) {
  const [modalData, setModalData] = useState({
    isOpen: false,
    affectation: null,
    semaine: null,
    classe: null,
    famille: null
  });

  const openCalendarModal = ({ affectation, semaine, classe, famille }) => {
    setModalData({
      isOpen: true,
      affectation,
      semaine,
      classe,
      famille
    });
  };

  const closeCalendarModal = () => {
    setModalData({
      isOpen: false,
      affectation: null,
      semaine: null,
      classe: null,
      famille: null
    });
  };

  return (
    <CalendarModalContext.Provider value={{ openCalendarModal, closeCalendarModal }}>
      {children}
      <CalendarModal
        isOpen={modalData.isOpen}
        onClose={closeCalendarModal}
        affectation={modalData.affectation}
        semaine={modalData.semaine}
        classe={modalData.classe}
        famille={modalData.famille}
      />
    </CalendarModalContext.Provider>
  );
}

export function useCalendarModal() {
  const context = useContext(CalendarModalContext);
  if (!context) {
    throw new Error('useCalendarModal must be used within a CalendarModalProvider');
  }
  return context;
}
