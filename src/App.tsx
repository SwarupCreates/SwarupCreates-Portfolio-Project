import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { CustomCursor } from './components/CustomCursor/CustomCursor';
import { DevTools } from './components/DevTools/DevTools';
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';
import { AnimationProvider } from './context/AnimationContext';

const App: React.FC = () => {
  return (
    <AnimationProvider>
      <BrowserRouter>
      <CustomCursor />
      <DevTools />
      <ThemeToggle />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </AnimationProvider>
  );
};

export default App;
