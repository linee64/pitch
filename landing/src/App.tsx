import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react"
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
      <Analytics />
    </Router>
  );
}

export default App;
