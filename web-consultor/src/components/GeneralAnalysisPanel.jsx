// web-consultor/src/components/GeneralAnalysisPanel.jsx (CÓDIGO FINAL COM FERRAMENTAS)

import React, { useState, useEffect } from 'react';
import SalesTable from './SalesTable'; 
import { fetchAnalytics } from '../supabase';

// Valores iniciais antes do carregamento
const initialMetrics = {
    avgTime: '—', 
    dailyCount: '—', 
    commissionValue: 'R$ 0,00', 
    closedSales: '—', 
    qrCodesSent: '—', 
    rating: '—', 
};

const MetricCard = ({ title, value }) => (
    <div style={styles.card}>
        <h4 style={styles.cardTitle}>{title}</h4>
        <p style={styles.cardValue}>{value}</p>
    </div>
);

const GeneralAnalysisPanel = ({ activeSubTab, setActiveSubTab }) => {
    // ESTADOS PARA ANALYTICS
    const [analytics, setAnalytics] = useState(initialMetrics);
    const [loading, setLoading] = useState(true);
    const currentUserId = localStorage.getItem('userId');
    
    // NOVOS ESTADOS PARA AS FERRAMENTAS
    const [searchTerm, setSearchTerm] = useState('');
    const [productStock, setProductStock] = useState('');
    const [qrCodeStatus, setQrCodeStatus] = useState('');

    // Efeito para carregar os dados de analytics (CÓDIGO INALTERADO)
    useEffect(() => {
        if (!currentUserId) {
            setLoading(false);
            return;
        }

        const loadAnalytics = async () => {
            setLoading(true);
            try {
                const data = await fetchAnalytics(currentUserId);
                setAnalytics(prev => ({ 
                    ...prev, 
                    ...data, 
                    closedSales: data.closedSales || 8,
                    qrCodesSent: data.qrCodesSent || 25,
                    rating: data.rating || 4.8,
                }));
            } catch (error) {
                console.error("Erro ao carregar dados de Analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        loadAnalytics();
    }, [currentUserId]); 

    
    // --- LÓGICA DAS FERRAMENTAS (NOVAS FUNÇÕES) ---

    // 1. Pesquisa de Estoque/Produto (Item 9)
    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setProductStock('Por favor, digite um SKU ou nome do produto.');
            return;
        }
        setProductStock(`Buscando ${searchTerm}...`);
        
        // Simulação de resposta da API de Estoque (o backend faria essa chamada)
        setTimeout(() => {
            if (searchTerm.toLowerCase().includes('sku402')) {
                setProductStock(`✅ SKU 402: 50 unidades em Estoque na Loja X.`);
            } else {
                setProductStock(`❌ Produto ou SKU não encontrado no estoque.`);
            }
        }, 1500);
    };

    // 2. Geração de QR Code Final (Item 10)
    const handleGenerateQR = () => {
        setQrCodeStatus('Gerando QR Code...');
        
        // Simulação de chamada para o Backend para gerar o QR Code
        setTimeout(() => {
            // O Backend retornaria a imagem do QR Code ou um link
            setQrCodeStatus(`✅ QR Code gerado com sucesso! Pronto para ser lido no caixa.`);
        }, 2000);
    };

    
    // Conteúdo da aba 'Visão Geral (Métricas)'
    const renderGeneralMetrics = () => (
        <div style={styles.contentContainer}>
            <h2 style={styles.title}>Métricas Chave {loading && <span style={styles.loadingText}>(Carregando...)</span>}</h2>
            
            {/* GRID DE MÉTRICAS */}
            <div style={styles.metricsGrid}>
                {/* DYNAMIC: Tempo Médio de Atendimento, Atendimento Diário, Valor de Comissão */}
                <MetricCard title="Tempo Médio de Atendimento" value={analytics.avgTime} />
                <MetricCard title="Atendimento Diário" value={analytics.dailyCount} />
                <MetricCard title="Valor de Comissão (Mês)" value={analytics.commissionValue} />
                
                {/* MOCK: Compras Fechadas, QR Codes Enviados, Avaliação Média */}
                <MetricCard title="Compras Fechadas (Total)" value={analytics.closedSales} />
                <MetricCard title="QR Codes Enviados" value={analytics.qrCodesSent} />
                <MetricCard title="Avaliação Média" value={analytics.rating} />
            </div>
            
            <h3 style={styles.subtitle}>Ferramentas de Suporte</h3>
            
            {/* 9. CAMPO DE PESQUISA DE ESTOQUE/PRODUTO */}
            <div style={styles.toolContainer}>
                <input 
                    type="text" 
                    placeholder="Pesquisar Produto/Estoque (ex: SKU 402)" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput} 
                />
                <button onClick={handleSearch} style={{...styles.toolButton, backgroundColor: '#364fab'}}>
                    Buscar Estoque
                </button>
            </div>
            {productStock && <p style={styles.stockResult}>{productStock}</p>}

            {/* 10. BOTÃO DE GERAÇÃO DE QR CODE FINAL */}
            <button onClick={handleGenerateQR} style={{...styles.toolButtonLarge, backgroundColor: '#28a745'}}>
                Gerar QR Code Final do Carrinho
            </button>
            {qrCodeStatus && <p style={styles.qrStatus}>{qrCodeStatus}</p>}
        </div>
    );

    // Conteúdo da aba 'Suas Vendas (Detalhes)'
    const renderSalesDetails = () => (
        <div style={styles.contentContainer}>
            <h2 style={styles.title}>Histórico de Vendas Detalhado</h2>
            <SalesTable />
        </div>
    );

    return (
        <div style={styles.container}>
            {activeSubTab === 'general' ? renderGeneralMetrics() : renderSalesDetails()}
        </div>
    );
};


const styles = {
    // ... (Mantém estilos existentes)
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
        color: '#343a40',
        display: 'flex',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: '14px',
        color: '#ffc107',
        marginLeft: '15px',
    },
    subtitle: {
        marginTop: '40px',
        marginBottom: '15px',
        color: '#495057',
    },
    metricsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
    },
    card: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        textAlign: 'center',
    },
    cardTitle: {
        fontSize: '14px',
        color: '#6c757d',
        margin: '0 0 5px 0',
    },
    cardValue: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#364fab',
        margin: 0,
    },
    // NOVOS ESTILOS PARA FERRAMENTAS
    toolContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
    },
    searchInput: {
        padding: '10px',
        borderRadius: '5px 0 0 5px',
        border: '1px solid #ccc',
        flexGrow: 1,
        fontSize: '16px',
    },
    toolButton: {
        padding: '10px 15px',
        color: 'white',
        border: 'none',
        borderRadius: '0 5px 5px 0',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
    },
    toolButtonLarge: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '15px',
    },
    stockResult: {
        backgroundColor: '#fff3cd',
        color: '#856404',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '20px',
        border: '1px solid #ffeeba',
    },
    qrStatus: {
        backgroundColor: '#d4edda',
        color: '#155724',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '20px',
        border: '1px solid #c3e6cb',
    }
};

export default GeneralAnalysisPanel;