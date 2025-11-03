// web-consultor/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx'; // Importa sua tela de Login

// Componente Placeholder para a Dashboard (que criaremos depois)
const DashboardPage = () => <h1>Dashboard do Consultor</h1>; 

// O App Principal que define as rotas
const AppRoutes = () => (
    <Router>
        <Routes>
            {/* Rota principal: / */}
            <Route path="/" element={<LoginPage />} />
            
            {/* Rota do Dashboard: /dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} /> 

            {/* Futuramente: Rota para o Chat (ex: /chat/:id) */}
            {/* Você pode adicionar rotas aqui */}
        </Routes>
    </Router>
);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AppRoutes />
    </React.StrictMode>,
);