import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from "./pages/RegisterPage";
import CategoriesAdminPage from "./pages/CategoriesAdminPage";
import EventsAdminPage from './pages/EventsAdminPage.tsx';

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/kategorije" element={<CategoriesAdminPage />} />
        <Route path="/events" element={<EventsAdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
