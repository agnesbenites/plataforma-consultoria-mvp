// web-consultor/src/pages/DashboardPage.jsx (CÓDIGO FINAL E CORRIGIDO PARA NOVAS ABAS)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GeneralAnalysisPanel from '../components/GeneralAnalysisPanel'; 
import ProfilePanel from '../components/ProfilePanel'; 
import ReferralPanel from '../components/ReferralPanel'; // <<< RENOMEADO DE NominatePanel
import ChatPanel from '../components/ChatPanel'; 
import HomePanel from '../components/HomePanel'; // <<< NOVO

// --- CONSTANTES DE NAVEGAÇÃO (AJUSTADAS) ---
const MAIN_TABS = {
    HOME: 'home', // <<< ADICIONADO
    CHAT: 'chat',
    ANALYSIS: 'analysis',
    PROFILE: 'profile',
    REFERRAL: 'referral', // <<< RENOMEADO
};

// Mock Data para a Lista de Clientes (Será substituído por dados do Supabase)
const MOCK_CLIENTS = [
    { id: 'cli-1', name: 'Ana Silva', isActive: true },
    { id: 'cli-2', name: 'João Mendes', isActive: false },
    // ...
];


// --- COMPONENTE DA LISTA DE CLIENTES (FILA DE ATENDIMENTO) ---
const ChatList = ({ activeClient, setActiveClient }) => {
    return (
        <div style={styles.chatListContainer}>
            <h4 style={styles.chatListHeader}>Clientes Ativos ({MOCK_CLIENTS.length})</h4>
            {MOCK_CLIENTS.map(client => (
                <div 
                    key={client.id}
                    style={{...styles.clientItem, 
                            backgroundColor: activeClient === client.id ? '#4a5789' : 'transparent'}}
                    onClick={() => setActiveClient(client.id)}
                >
                    {client.name} {client.isActive && <span style={styles.activeDot}>●</span>}
                </div>
            ))}
        </div>
    );
};


const DashboardPage = () => {
    const navigate = useNavigate();
    // Estado principal de navegação (HOME é o padrão)
    const [activeMainTab, setActiveMainTab] = useState(MAIN_TABS.HOME); // <<< ALTERADO PARA HOME
    // Sub-estado para Análise
    const [activeAnalysisSubTab, setActiveAnalysisSubTab] = useState('general');
    // Estado para o cliente ativo no Chat
    const [activeClient, setActiveClient] = useState(MOCK_CLIENTS[0].id);

    // Função de Logout (ADICIONADA AQUI)
    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        navigate('/');
    };
    
    const renderContent = () => {
        const currentClientName = MOCK_CLIENTS.find(c => c.id === activeClient)?.name || "N/A";

        switch (activeMainTab) {
            case MAIN_TABS.HOME: // <<< NOVO
                return <HomePanel />; 
                
            case MAIN_TABS.CHAT:
                // Quando o CHAT está ativo, mostramos o ChatPanel
                return <ChatPanel currentClientName={currentClientName} />;
                
            case MAIN_TABS.ANALYSIS:
                // Painel de Análise (com sub-abas)
                return (
                    <GeneralAnalysisPanel 
                        activeSubTab={activeAnalysisSubTab} 
                        setActiveSubTab={setActiveAnalysisSubTab} 
                    />
                );
            case MAIN_TABS.PROFILE:
                return <ProfilePanel />;
            case MAIN_TABS.REFERRAL: // <<< RENOMEADO
                return <ReferralPanel />;
                
            default:
                // Redireciona para o painel de HOME como fallback
                return <HomePanel />;
        }
    };

    // Função para renderizar um botão do menu principal
    const renderMainTabButton = (tabKey, label) => (
        <button 
            style={activeMainTab === tabKey ? styles.activeTabButton : styles.tabButton} 
            onClick={() => {
                setActiveMainTab(tabKey);
                // Resetar o sub-menu ao trocar de aba principal
                if (tabKey === MAIN_TABS.ANALYSIS) {
                    setActiveAnalysisSubTab('general');
                }
            }}
        >
            {label}
        </button>
    );


    return (
        <div style={styles.fullScreenContainer}>
            {/* 1. Menu Lateral (Barra de Navegação - Fixo: 250px) */}
            <div style={styles.navBarContainer}>
                <h3 style={styles.headerTitle}>Compra Smart</h3>
                
                {/* Menu Principal */}
                <div style={styles.navGroup}>
                    
                    {renderMainTabButton(MAIN_TABS.HOME, 'Home')} {/* <<< NOVO BOTÃO HOME */}
                    
                    {renderMainTabButton(MAIN_TABS.CHAT, 'Chat')}
                    
                    {/* Lista de Chats SÓ APARECE SE A ABA CHAT ESTIVER ATIVA */}
                    {activeMainTab === MAIN_TABS.CHAT && (
                        <div style={styles.chatListWrapper}>
                             <ChatList activeClient={activeClient} setActiveClient={setActiveClient} />
                        </div>
                    )}

                    {renderMainTabButton(MAIN_TABS.ANALYSIS, 'Análise Geral')}
                    
                    {/* Sub-Menu de Análise (Aparece se a aba Análise estiver ativa) */}
                    {activeMainTab === MAIN_TABS.ANALYSIS && (
                        <div style={styles.subNavGroup}>
                            <button 
                                style={activeAnalysisSubTab === 'general' ? styles.activeSubTabButton : styles.subTabButton}
                                onClick={() => setActiveAnalysisSubTab('general')}
                            >
                                Visão Geral (Métricas)
                            </button>
                            <button 
                                style={activeAnalysisSubTab === 'sales_detail' ? styles.activeSubTabButton : styles.subTabButton}
                                onClick={() => setActiveAnalysisSubTab('sales_detail')}
                            >
                                Suas Vendas (Detalhes)
                            </button>
                        </div>
                    )}

                    {renderMainTabButton(MAIN_TABS.PROFILE, 'Perfil')}
                    {renderMainTabButton(MAIN_TABS.REFERRAL, 'Indique Aqui')}
                </div>
                
                <button onClick={handleLogout} style={styles.logoutButton}>Sair</button> {/* <<< AGORA CHAMA A FUNÇÃO DE LOGOUT */}
            </div>

            {/* 2. Área Principal de Conteúdo (Ocupa o Restante) */}
            <div style={styles.mainContentContainer}>
                {renderContent()}
            </div>
        </div>
    );
};

const styles = {
    // ... (Estilos mantidos) ...
    fullScreenContainer: {
        display: 'flex',
        height: '100vh', 
        width: '100vw',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        fontFamily: 'Arial, sans-serif',
    },
    navBarContainer: {
        width: '250px', 
        backgroundColor: '#343a40', 
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', 
        boxShadow: '2px 0 5px rgba(0,0,0,0.15)',
    },
    headerTitle: {
        padding: '20px', 
        margin: 0, 
        backgroundColor: '#364fab', 
        textAlign: 'center',
        fontSize: '18px',
        fontWeight: 'bold',
    },
    navGroup: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1, 
        overflowY: 'auto',
    },
    tabButton: {
        background: 'none',
        border: 'none',
        color: '#ccc',
        padding: '12px 20px',
        textAlign: 'left',
        cursor: 'pointer',
        fontSize: '16px',
        borderBottom: '1px solid #3c444c',
    },
    activeTabButton: {
        background: '#4a5789',
        border: 'none',
        color: 'white',
        padding: '12px 20px',
        textAlign: 'left',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        borderBottom: '1px solid #4a5789',
    },
    chatListWrapper: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#2b3137',
        borderTop: '1px solid #3c444c',
        borderBottom: '1px solid #3c444c',
    },
    chatListHeader: {
        padding: '10px 20px',
        margin: 0,
        fontSize: '14px',
        color: '#999',
        borderBottom: '1px solid #444',
    },
    clientItem: {
        padding: '12px 20px',
        cursor: 'pointer',
        borderBottom: '1px solid #444',
        transition: 'background-color 0.2s',
        fontSize: '15px',
    },
    activeDot: {
        color: '#28a745',
        marginLeft: '5px',
        fontSize: '10px',
    },
    subNavGroup: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#2b3137',
        borderTop: '1px solid #3c444c',
        borderBottom: '1px solid #3c444c',
    },
    subTabButton: {
        background: 'none',
        border: 'none',
        color: '#999',
        padding: '8px 30px',
        textAlign: 'left',
        cursor: 'pointer',
        fontSize: '14px',
    },
    activeSubTabButton: {
        background: '#343a40',
        border: 'none',
        color: '#66ccff', 
        padding: '8px 30px',
        textAlign: 'left',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
    },
    logoutButton: {
        background: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '15px 20px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
    },
    mainContentContainer: {
        flexGrow: 1,
        backgroundColor: '#f8f9fa',
        overflowY: 'auto',
    },
};

export default DashboardPage;