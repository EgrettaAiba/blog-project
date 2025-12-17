import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePostPage from './pages/CreatePostPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from "./pages/FavoritesPage";
import UsersPage from './pages/UsersPage';

import Header from './components/Header';
import ProtectedRoute from './auth/ProtectedRoute';
import GuestRoute from './auth/GuestRoute';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />

        <Routes>
          {/* 👤 ГОСТИ */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />

          <Route
            path="/register"
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />

          {/* 🔐 АВТОРИЗОВАННЫЕ */}
          <Route path="/" element={<HomePage />} />

          <Route
            path="/posts/create"
            element={
              <ProtectedRoute message="Перед написанием летописи войдите или зарегистрируйтесь">
                <CreatePostPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />

          {/* 🔍 ПОИСК ПОЛЬЗОВАТЕЛЕЙ */}
          <Route
            path="/users"
            element={
              <ProtectedRoute message="Поиск людей доступен лишь вошедшим">
                <UsersPage />
              </ProtectedRoute>
            }
          />
        </Routes>

      </Router>
    </AuthProvider>
  );
}
