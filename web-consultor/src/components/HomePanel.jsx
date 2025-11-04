// web-consultor/src/components/HomePanel.jsx (CÓDIGO ATUALIZADO COM BANNER ROTATIVO)

import React from 'react';
import RotatingBanner from './RotatingBanner'; // <<< NOVO IMPORT

// Dados Mockados (mantidos)
const agenda = [
    { time: '10:00', client: 'Alice Xavier', type: 'Vídeo Chamada', status: 'Agendado' },
    { time: '11:30', client: 'Bruno Costa', type: 'Chat Prioritário', status: 'Pendente' },
    { time: '14:00', client: 'Carla Diaz', type: 'Áudio', status: 'Concluído' },
];

const priceAlerts = [
    { product: 'Geladeira Inverter', oldPrice: 2800, newPrice: 2499, segment: 'Eletrodomésticos', store: 'Loja X' },
    { product: 'Smart TV 55" 4K', oldPrice: 3500, newPrice: 3150, segment: 'Tecnologia', store: 'Magazine Y' },
    { product: 'Notebook Gamer', oldPrice: 5000, newPrice: 4800, segment: 'Tecnologia', store: 'Loja X' },
];

const HomePanel = () => {
    
    // ... (Funções renderAgenda e renderPriceAlerts - MANTIDAS) ...
    const renderAgenda = () => (
        <div style={styles.card}>
            <h3 style={styles.cardTitle}>Agenda de Chamadas do Dia</h3>
            {agenda.map((item, index) => (
                <div key={index} style={styles.agendaItem}>
                    <span style={styles.agendaTime}>{item.time}</span>
                    <span style={styles.agendaClient}>Cliente: <strong>{item.client}</strong></span>
                    <span style={styles.agendaType}>Tipo: {item.type}</span>
                    <span style={{...styles.agendaStatus, backgroundColor: item.status === 'Agendado' ? '#ffc107' : item.status === 'Concluído' ? '#28a745' : '#6c757d'}}>
                        {item.status}
                    </span>
                </div>
            ))}
            <p style={styles.note}>Total de {agenda.length} compromissos agendados.</p>
        </div>
    );

    const renderPriceAlerts = () => (
        <div style={styles.card}>
            <h3 style={styles.cardTitle}>🚨 Alertas de Preço no Seu Segmento</h3>
            {priceAlerts.map((alert, index) => (
                <div key={index} style={styles.alertItem}>
                    <p style={styles.alertProduct}>**{alert.product}** ({alert.segment})</p>
                    <p style={styles.alertPrice}>De R$ {alert.oldPrice.toFixed(2)} para <strong style={styles.newPrice}>R$ {alert.newPrice.toFixed(2)}</strong></p>
                    <span style={styles.alertStore}>Loja: {alert.store}</span>
                </div>
            ))}
            <p style={styles.note}>Use esses alertas como argumentos de venda no chat!</p>
        </div>
    );

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Bem-vindo(a), {localStorage.getItem('userName') || 'Consultor(a)'}!</h2>
            
            <RotatingBanner /> {/* <<< INSERÇÃO DO BANNER AQUI */}

            <div style={styles.contentGrid}>
                {renderAgenda()}
                {renderPriceAlerts()}
            </div>
        </div>
    );
};

const styles = {
    // ... (Estilos MANTIDOS) ...
    container: {
        padding: '30px',
        backgroundColor: '#f8f9fa',
        fontFamily: 'Arial, sans-serif',
        minHeight: '100%',
    },
    title: {
        borderBottom: '2px solid #ddd',
        paddingBottom: '10px',
        marginBottom: '20px',
        color: '#1b3670',
    },
    contentGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px',
    },
    card: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
    },
    cardTitle: {
        fontSize: '18px',
        color: '#343a40',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px',
        marginBottom: '15px',
        fontWeight: 'bold',
    },
    agendaItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderBottom: '1px dotted #ddd',
        alignItems: 'center',
    },
    agendaTime: { fontWeight: 'bold', color: '#1b3670', width: '15%' },
    agendaClient: { width: '40%' },
    agendaType: { width: '20%', fontSize: '14px', color: '#6c757d' },
    agendaStatus: { padding: '5px 10px', borderRadius: '15px', color: 'white', fontSize: '12px', textAlign: 'center' },
    alertItem: {
        padding: '10px 0',
        borderBottom: '1px dotted #eee',
    },
    alertProduct: { margin: '0 0 5px 0', fontWeight: 'bold', color: '#343a40' },
    alertPrice: { margin: '0 0 5px 0', fontSize: '16px' },
    newPrice: { color: '#dc3545', fontWeight: 'bold', fontSize: '18px' },
    alertStore: { fontSize: '12px', color: '#6c757d' },
    note: {
        fontSize: '14px',
        color: '#6c757d',
        marginTop: '15px',
        fontStyle: 'italic',
    },
};

export default HomePanel;