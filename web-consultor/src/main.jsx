// web-consultor/src/main.jsx (CÓDIGO FINAL E LIMPO)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx'; 
import ConsultantRegisterPage from './pages/ConsultantRegisterPage.jsx'; 
import DashboardPage from './pages/DashboardPage.jsx'; 
import TermsPage from './pages/TermsPage.jsx'; 
// import './App.css'; // <<< REMOVER ESTA LINHA SE ELA EXISTIR
import './GlobalStyles.css'; // <<< MUDAR AQUI PARA O NOVO NOME
import './index.css';


const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register-consultor" element={<ConsultantRegisterPage />} /> 
            <Route path="/dashboard" element={<DashboardPage />} /> 
            <Route path="/terms" element={<TermsPage />} /> 
        </Routes>
    </Router>
);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AppRoutes />
    </React.StrictMode>,
);