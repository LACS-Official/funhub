import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home.jsx';
import MiPenUnlocker from './MiPenUnlocker.jsx';
import MiRainbowBattery from './MiRainbowBattery.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mipen-unlocker" element={<MiPenUnlocker />} />
        <Route path="/mi-rainbow-battery" element={<MiRainbowBattery />} />
        <Route path="/mi-rainbow-battery/tools" element={<MiRainbowBattery />} />
        {/* 处理404页面 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;