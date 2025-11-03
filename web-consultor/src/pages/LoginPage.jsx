// web-consultor/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginConsultor } from '../api/authApi';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isHovering, setIsHovering] = useState(false); // Novo estado para lidar com hover no React
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const userData = await loginConsultor(email, password);

            // CRÍTICO: Verifica se o usuário é realmente um consultor
            if (userData.type !== 'consultant') {
                setError('Acesso negado: Este e-mail não é de um consultor.');
                return;
            }

            // Sucesso: Salvar token no Local Storage
            localStorage.setItem('userToken', userData.token);
            localStorage.setItem('userName', userData.name);
            localStorage.setItem('userId', userData.user_id);

            // Redirecionar para o Dashboard 
            navigate('/dashboard');

        } catch (err) {
            setError(err.message || 'Erro ao tentar fazer login.');
        }
    };

    // Estilos do botão que dependem do estado de hover
    const buttonStyle = isHovering ? { ...styles.button, ...styles.buttonHover } : styles.button;

    return (
        <div style={styles.container}>
            {/* LOGO NO CANTO SUPERIOR DIREITO */}
            <img src="/img/logo_compra_smart.png" alt="Compra Smart Logo" style={styles.logo} />

            <div style={styles.card}>
                <h2 style={styles.title}>Login do Consultor</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="E-mail do Consultor"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <button 
                        type="submit" 
                        style={buttonStyle} // Aplica o estilo dinâmico
                        onMouseEnter={() => setIsHovering(true)} // Lógica de Hover (Mouse Entra)
                        onMouseLeave={() => setIsHovering(false)} // Lógica de Hover (Mouse Sai)
                    >
                        Entrar
                    </button>
                    {error && <p style={styles.error}>{error}</p>}
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#f0f2f5',
        position: 'relative', 
        fontFamily: 'Arial, sans-serif', 
    },
    logo: {
        position: 'absolute',
        top: '20px',       
        right: '20px',     
        width: '180px',    
        height: 'auto',
    },
    card: { 
        background: 'white', 
        padding: '40px', 
        borderRadius: '10px', 
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
        textAlign: 'center',
        zIndex: 1, 
    },
    title: {
        fontSize: '24px',
        marginBottom: '20px',
        color: '#333',
    },
    input: { 
        width: '100%', 
        padding: '12px', 
        margin: '10px 0', 
        borderRadius: '5px', 
        border: '1px solid #ccc',
        fontSize: '16px',
    },
    button: { 
        width: '100%', 
        padding: '12px', 
        backgroundColor: '#364fab', // <<< COR PRINCIPAL: #364fab
        color: 'white', 
        border: 'none', 
        borderRadius: '5px', 
        cursor: 'pointer', 
        marginTop: '15px',
        fontSize: '18px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: { // <<< EFEITO DE HOVER: Cor mais escura
        backgroundColor: '#2c3d9a', 
    },
    error: { 
        color: '#d9534f', 
        marginTop: '15px',
        fontSize: '14px',
    },
};

export default LoginPage;