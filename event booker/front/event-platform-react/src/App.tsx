import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from "./pages/RegisterPage";
import CategoriesAdminPage from "./pages/CategoriesAdminPage";
import EventsAdminPage from './pages/EventsAdminPage.tsx';
import SearchPage from './pages/SearchPage.tsx';
import EventDetailPage from './pages/EventDetailPage.tsx';
import AdminUserPage from "./pages/AdminUserPage";
import CategoryEventsPage from "./pages/CategoryEventsPage";
import NajposecenijiPage from "./pages/NajposecenijiPage";

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
        <Route path="/search" element={<SearchPage />} />
        <Route path="/dogadjaj/:id" element={<EventDetailPage />} /> 
        <Route path="/users" element={<AdminUserPage />} />
        <Route path="/kategorije/:id" element={<CategoryEventsPage />} />
        <Route path="/najposeceniji" element={<NajposecenijiPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
