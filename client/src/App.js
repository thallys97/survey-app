//import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import SurveyCreator from './components/SurveyCreator';
import SurveyResponder from './components/SurveyResponder';
import UserManagement from './components/UserManagement';
import WaitingSurveys from './components/WaitingSurveys';
import RespondedSurveys from './components/RespondedSurveys';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/create-survey" 
            element={
              <PrivateRoute>
                <SurveyCreator />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/respond-survey" 
            element={
              <PrivateRoute>
                <SurveyResponder />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/user-management" 
            element={
              <PrivateRoute>
                <UserManagement />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/waiting-surveys" 
            element={
              <PrivateRoute>
                <WaitingSurveys />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/responded-surveys" 
            element={
              <PrivateRoute>
                <RespondedSurveys />
              </PrivateRoute>
            } 
          />
          {/* ...other routes */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;