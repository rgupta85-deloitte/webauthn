import { Routes, Route, Navigate } from 'react-router-dom';
import { PreLoginInterimPage } from './pages/PreLoginInterimPage/PreLoginInterimPage';
import { PreLoginPage } from './pages/PreLoginPage/PreLoginPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/pre-login-interim" replace />} />
      <Route path="/pre-login-interim" element={<PreLoginInterimPage />} />
      <Route path="/pre-login" element={<PreLoginPage />} />
      <Route path="*" element={<Navigate to="/pre-login-interim" replace />} />
    </Routes>
  );
}

export default App;
