import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const DemoContext = createContext();

export const DemoProvider = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Ctrl + Shift + D
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault(); // Prevent default browser behavior (bookmarking etc.)
        
        setIsDemoMode((prevMode) => {
          const newMode = !prevMode;
          
          if (newMode) {
            toast.success("GOD MODE ACTIVATED 🛡️", {
              style: {
                background: '#8B5CF6',
                color: '#fff',
                fontWeight: 'bold'
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#8B5CF6',
              },
            });
          } else {
            toast("DEMO MODE OFF", {
              icon: '🔴',
              style: {
                background: '#374151',
                color: '#fff',
                fontWeight: 'bold'
              }
            });
          }
          
          return newMode;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <DemoContext.Provider value={{ isDemoMode, setIsDemoMode }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
