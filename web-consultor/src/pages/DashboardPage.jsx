// web-consultor/src/pages/DashboardPage.jsx

import React from 'react';

const DashboardPage = () => {
    // Por enquanto, apenas a mensagem de sucesso
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Painel do Consultor</h1>
            <p style={styles.subtitle}>Você fez login com sucesso!</p>
            {/* Aqui será a lista de chats e o painel de informações */}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#e9ecef',
    },
    title: {
        fontSize: '32px',
        color: '#364fab', // Cor do seu botão
        marginBottom: '10px',
    },
    subtitle: {
        fontSize: '18px',
        color: '#6c757d',
    },
};

export default DashboardPage;