// web-consultor/src/components/ChatPanel.jsx (CÓDIGO FINAL COM REGRAS DE NEGÓCIO E CARRINHO)

import React, { useState, useEffect, useRef } from 'react';
import Message from './Message'; 
import { supabase } from '../supabase'; 

// --- NOVO: LÓGICA DO CARRINHO DE COMPRAS ---
const ShoppingCart = ({ cartItems, onRemoveItem, onGenerateQRCode }) => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div style={styles.cartContainer}>
            <h4 style={styles.cartTitle}>🛒 Carrinho do Cliente</h4>
            <div style={styles.cartItemsList}>
                {cartItems.length === 0 ? (
                    <p style={styles.noResults}>Carrinho vazio.</p>
                ) : (
                    cartItems.map((item, index) => (
                        <div key={index} style={styles.cartItem}>
                            <p style={styles.itemName}>
                                {item.name} ({item.quantity}x)
                                <span style={styles.itemPrice}>R$ {(item.price * item.quantity).toFixed(2)}</span>
                            </p>
                            <button onClick={() => onRemoveItem(item.id)} style={styles.removeButton}>Editar/Remover</button>
                        </div>
                    ))
                )}
            </div>
            
            <p style={styles.cartTotal}>Total: <strong>R$ {total.toFixed(2)}</strong></p>

            <button 
                onClick={onGenerateQRCode} 
                disabled={cartItems.length === 0} 
                style={styles.qrButton}
            >
                Gerar QR Code (Fechar Carrinho)
            </button>
        </div>
    );
};


// --- COLUNA DE BUSCA DE ESTOQUE ---
const InventorySearch = ({ onInsertProduct }) => {
    // ... (Lógica de busca de estoque mockada - MANTIDA) ...
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const mockInventory = [
        { id: 1, name: 'Geladeira Inverter', sku: 'INVT001', stock: 5, price: 2499.00 },
        { id: 2, name: 'Smart TV 55" 4K', sku: 'TV55K', stock: 12, price: 3150.00 },
        { id: 3, name: 'Fone BT PowerBass', sku: 'FB002', stock: 120, price: 499.00 },
    ];

    const handleSearch = () => {
        setLoading(true);
        const results = mockInventory.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            item.sku.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setTimeout(() => {
            setSearchResults(results);
            setLoading(false);
        }, 500);
    };

    return (
        <div style={styles.inventorySearchContainer}>
            <h4 style={styles.inventoryTitle}>Busca Rápida de Estoque</h4>
            <div style={styles.searchBar}>
                <input 
                    type="text"
                    placeholder="Buscar SKU ou Produto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                    style={styles.inventoryInput}
                />
                <button onClick={handleSearch} style={styles.searchButton}>
                    {loading ? '...' : 'Buscar'}
                </button>
            </div>
            
            <div style={styles.resultsList}>
                {searchResults.length > 0 ? (
                    searchResults.map(item => (
                        <div key={item.id} style={styles.productItem}>
                            <p style={styles.productName}>{item.name}</p>
                            <p style={styles.productDetails}>
                                SKU: {item.sku} | Estoque: <strong style={{color: item.stock < 20 ? 'red' : 'green'}}>{item.stock}</strong> un.
                                <br/>Preço: R$ {item.price.toFixed(2)}
                            </p>
                            <button 
                                onClick={() => onInsertProduct(item)} 
                                style={styles.insertButton}
                            >
                                Inserir Produto
                            </button>
                        </div>
                    ))
                ) : (
                    <p style={styles.noResults}>{searchTerm.length > 0 && !loading ? 'Nenhum produto encontrado.' : 'Digite para buscar.'}</p>
                )}
            </div>
        </div>
    );
};


// --- CHAT PRINCIPAL ---
const ChatPanel = () => {
    // === ESTADOS DO CHAT E CARRINHO ===
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [cart, setCart] = useState([]);
    const [timer, setTimer] = useState(900); // 15 minutos = 900 segundos
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [clients, setClients] = useState([
        // CLIENTES MOCKADOS: Agora usam ID e têm a flag 'inStore'
        { id: 'cli-735', name: '?', inStore: true, lastMessage: 'Olá, estou na loja X. Pode me ajudar?' },
        { id: 'cli-481', name: '?', inStore: false, lastMessage: 'Queria saber sobre TVs.' },
    ]);
    const [activeClient, setActiveClient] = useState(clients[0]);

    const timerRef = useRef();


    // --- LÓGICA DE TEMPO (15 MINUTOS) ---
    useEffect(() => {
        // Zera o timer ao trocar de cliente
        setTimer(900); 
        setIsTimerActive(activeClient.inStore); // Ativa SÓ se o cliente estiver na loja

        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        if (activeClient.inStore) {
            timerRef.current = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        alert(`Tempo limite de atendimento esgotado para o Cliente ${activeClient.id} na loja!`);
                        setIsTimerActive(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        // Cleanup
        return () => clearInterval(timerRef.current);
    }, [activeClient]);

    // Lógica Real-time e Histórico (MANTIDA)
    useEffect(() => {
        setMessages([
            { id: 1, user: activeClient.id, content: activeClient.lastMessage, timestamp: '01:06:52', type: 'inbound' },
        ]);
        const channel = supabase.channel('chat_room');
        channel.subscribe(); 
        return () => channel.unsubscribe();
    }, [activeClient]);


    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    // --- LÓGICA DO CARRINHO ---
    const handleInsertProduct = (product) => {
        // Checa se o produto já está no carrinho
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            setCart(cart.map(item => 
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }

        // Insere mensagem no chat
        const productMessage = `Adicionei 1x ${product.name} (SKU: ${product.sku}) ao carrinho.`;
        setMessages(prev => [...prev, { id: prev.length + 1, user: 'Consultor', content: productMessage, timestamp: new Date().toLocaleTimeString().substring(0, 7), type: 'system' }]);
    };

    const handleRemoveItem = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const handleGenerateQRCode = () => {
        alert(`QR Code Gerado! Enviando e-mail para o cliente ${activeClient.id} com a lista de produtos. (Compra finalizada e pronta para pagamento no caixa)`);
        setCart([]); // Limpa o carrinho após fechar a compra

        // Lógica futura: API call para gerar QR e enviar e-mail (Item 4)
    };
    
    // --- LÓGICA DE CHAT ---
    const handleSend = (e) => {
        e.preventDefault();
        if (input.trim() === '') return;

        const newMessage = {
            id: messages.length + 1,
            user: 'Consultor',
            content: input,
            timestamp: new Date().toLocaleTimeString().substring(0, 7),
            type: 'outbound',
        };
        
        setMessages([...messages, newMessage]);
        setInput('');
    };

    const handleCall = (type) => {
        // Lógica de restrição de vídeo (Item 3 - Mock: apenas 'cli-735' permite vídeo)
        if (type === 'Vídeo Chamada' && activeClient.id === 'cli-481') {
             alert('Atenção: A loja associada a este cliente não permite Vídeo Chamada neste plano.');
             return;
        }
        alert(`Iniciando ${type} com o Cliente ${activeClient.id}... (Simulação)`);
    };


    // --- RENDERIZAÇÃO ---
    return (
        <div style={styles.fullContainer}> 
            
            {/* 1. Coluna de Clientes (SÓ MOSTRA O ID) */}
            <div style={styles.clientList}>
                <h3 style={styles.listTitle}>Clientes na Fila ({clients.length})</h3>
                {clients.map(client => (
                    <div 
                        key={client.id} 
                        style={{...styles.clientItem, backgroundColor: client.id === activeClient.id ? '#364fab' : 'transparent', color: client.id === activeClient.id ? 'white' : 'black'}}
                        onClick={() => setActiveClient(client)}
                    >
                        <p style={{margin: 0, fontWeight: 'bold'}}>ID: {client.id}</p>
                        <span style={styles.lastMessage}>{client.lastMessage.substring(0, 30)}...</span>
                        {client.inStore && <span style={styles.inStoreTag}>Na Loja</span>}
                    </div>
                ))}
            </div>

            {/* 2. Coluna Principal do Chat */}
            <div style={styles.chatArea}>
                <div style={styles.chatHeader}>
                    <h2 style={styles.chatHeaderTitle}>Atendimento: ID {activeClient.id}</h2>
                    <div style={styles.callButtons}>
                        {activeClient.inStore && (
                            <span style={{...styles.timerBox, backgroundColor: timer <= 120 ? '#dc3545' : '#1b3670'}}>
                                ⏱️ {formatTime(timer)}
                            </span>
                        )}
                        <button onClick={() => handleCall('Vídeo Chamada')} style={styles.videoButton}>
                            🎥 Vídeo
                        </button>
                        <button onClick={() => handleCall('Áudio')} style={styles.audioButton}>
                            🎙️ Áudio
                        </button>
                    </div>
                </div>

                <div style={styles.messagesContainer}>
                    {messages.map(msg => (
                        <Message key={msg.id} content={msg.content} user={msg.user} type={msg.type} timestamp={msg.timestamp} />
                    ))}
                    {activeClient.name === '?' && (
                        <p style={styles.nameQuery}>*O cliente ainda não forneceu o nome. Use o chat para perguntar: 'Como você gostaria de ser chamado(a)?'</p>
                    )}
                </div>

                <form onSubmit={handleSend} style={styles.inputContainer}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Digite sua mensagem ou insira um produto..."
                        style={styles.inputField}
                    />
                    <button type="submit" style={styles.sendButton}>Enviar</button>
                </form>
            </div>

            {/* 3. Coluna de Estoque e Carrinho */}
            <div style={styles.inventoryAndCartContainer}>
                <InventorySearch onInsertProduct={handleInsertProduct} />
                <ShoppingCart 
                    cartItems={cart} 
                    onRemoveItem={handleRemoveItem} 
                    onGenerateQRCode={handleGenerateQRCode} 
                />
            </div>
        </div>
    );
};


// === ESTILOS PARA CHAT, CARRINHO E INVENTÁRIO ===
const styles = {
    fullContainer: {
        display: 'grid',
        gridTemplateColumns: '250px 1fr 300px', /* Clientes, Chat, Estoque/Carrinho */
        width: '100%', 
        height: '100%',
        backgroundColor: '#f8f9fa',
        fontFamily: 'Arial, sans-serif',
    },
    // 1. CLIENTES
    clientList: {
        backgroundColor: '#f1f1f1',
        borderRight: '1px solid #ddd',
        overflowY: 'auto',
    },
    listTitle: { padding: '15px', margin: 0, backgroundColor: '#e9ecef', color: '#343a40', fontSize: '16px', },
    clientItem: { padding: '15px', borderBottom: '1px solid #e1e1e1', cursor: 'pointer', position: 'relative', transition: 'background-color 0.2s', },
    lastMessage: { fontSize: '12px', color: '#888' },
    inStoreTag: { padding: '3px 8px', backgroundColor: '#ffc107', color: '#333', fontSize: '11px', borderRadius: '3px', marginLeft: '5px' },
    // 2. CHAT PRINCIPAL
    chatArea: { display: 'flex', flexDirection: 'column', backgroundColor: 'white', borderRight: '1px solid #ddd', },
    chatHeader: { padding: '15px 20px', borderBottom: '1px solid #ddd', backgroundColor: '#f9f9f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', },
    chatHeaderTitle: { margin: 0, color: '#1b3670' },
    callButtons: { display: 'flex', gap: '10px', alignItems: 'center' },
    videoButton: { padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    audioButton: { padding: '8px 15px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    timerBox: { padding: '8px 10px', color: 'white', borderRadius: '5px', fontWeight: 'bold' }, // NOVO ESTILO TIMER
    messagesContainer: { flexGrow: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5', },
    nameQuery: { fontStyle: 'italic', color: '#6c757d', textAlign: 'center', marginTop: '10px' },
    inputContainer: { padding: '10px 20px', borderTop: '1px solid #ddd', display: 'flex', },
    inputField: { flexGrow: 1, padding: '10px', borderRadius: '5px 0 0 5px', border: '1px solid #ccc' },
    sendButton: { padding: '10px 15px', backgroundColor: '#1b3670', color: 'white', border: 'none', borderRadius: '0 5px 5px 0', cursor: 'pointer' },
    // 3. ESTOQUE E CARRINHO
    inventoryAndCartContainer: {
        padding: '15px',
        backgroundColor: '#fff',
        borderLeft: '1px solid #ddd',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
    },
    // --- ESTILOS DE ESTOQUE ---
    inventorySearchContainer: { flexShrink: 0, borderBottom: '1px solid #eee', marginBottom: '15px', paddingBottom: '15px' },
    inventoryTitle: { borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px', color: '#1b3670', },
    searchBar: { display: 'flex', marginBottom: '15px' },
    inventoryInput: { padding: '8px', borderRadius: '5px 0 0 5px', border: '1px solid #ccc', flexGrow: 1 },
    searchButton: { padding: '8px 15px', backgroundColor: '#364fab', color: 'white', border: 'none', borderRadius: '0 5px 5px 0', cursor: 'pointer' },
    resultsList: { marginTop: '10px' },
    productItem: { border: '1px solid #ddd', borderRadius: '5px', padding: '10px', marginBottom: '10px', backgroundColor: '#f9f9f9', },
    productName: { margin: '0 0 5px 0', fontWeight: 'bold' },
    productDetails: { margin: 0, fontSize: '12px', color: '#6c757d' },
    insertButton: { padding: '5px 10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginTop: '8px', width: '100%', },
    noResults: { color: '#888', textAlign: 'center' },
    // --- ESTILOS DE CARRINHO ---
    cartContainer: { flexGrow: 1, paddingTop: '15px' },
    cartTitle: { borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px', color: '#1b3670', },
    cartItemsList: { marginBottom: '15px' },
    cartItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px dotted #ccc' },
    itemName: { margin: 0, fontSize: '14px', flexGrow: 1 },
    itemPrice: { fontWeight: 'bold', marginLeft: '10px' },
    removeButton: { padding: '3px 8px', backgroundColor: '#f0ad4e', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' },
    cartTotal: { fontSize: '18px', fontWeight: 'bold', borderTop: '2px solid #333', paddingTop: '10px' },
    qrButton: { width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '15px', fontWeight: 'bold' },
};

export default ChatPanel;