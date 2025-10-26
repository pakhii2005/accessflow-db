import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar.jsx';
import HomePage from './Components/HomePage.jsx';
import SignupPage from './Components/SignupPage.jsx';
import LoginPage from './Components/LoginPage.jsx';
import DashboardPage from './Components/Dashboard.jsx';
import ProfilePage from './Components/ProfilePage.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  return (
    <>
    <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </>
      
    
  );
}

export default App;