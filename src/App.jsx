import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Landing } from './pages/Landing/Landing';
import { Login } from './pages/Login/Login';
import { Signup } from './pages/Signup/Signup';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Applications } from './pages/Applications/Applications';
import { Interviews } from './pages/Interviews/Interviews';
import { InterviewDetailsPage } from './pages/Interviews/InterviewDetailsPage';
import { Calendar } from './pages/Calendar/Calendar';
import { Questions } from './pages/Questions/Questions';
import { QuestionDetailsPage } from './pages/Questions/QuestionDetailsPage';
import { Resources } from './pages/Resources/Resources';
import { ResourceDetailsPage } from './pages/Resources/ResourceDetailsPage';
import { Contacts } from './pages/Contacts/Contacts';
import { ContactDetailsPage } from './pages/Contacts/ContactDetailsPage';
import { Placeholder } from './pages/Placeholder';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/*  Dashboard Routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/interviews" element={<Interviews />} />
            <Route path="/interviews/:id" element={<InterviewDetailsPage />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/questions/:id" element={<QuestionDetailsPage />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/:id" element={<ResourceDetailsPage />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/contacts/:id" element={<ContactDetailsPage />} />
            <Route path="/settings" element={<Placeholder />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Analytics />
      </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
