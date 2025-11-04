// web-consultor/src/components/ProfilePanel.jsx

import React from 'react';

const mockProfile = {
    stores: ['Magazine X (Eletrônicos)', 'Loja Y (Decoração)'],
    segments: ['Eletrodomésticos', 'Móveis'],
    bankData: 'Banco 341 - Ag. 1234 - C/C 56789-0',
    cvStatus: 'Completo',
};

const ProfilePanel = () => {
    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Meu Perfil e Afiliação</h2>
            
            <div style={styles.section}>
                <h3>Lojas e Segmentos Associados</h3>
                <p><strong>Lojas:</strong> {mockProfile.stores.join(', ')}</p>
                <p><strong>Segmentos:</strong> {mockProfile.segments.join(', ')}</p>
            </div>

            <div style={styles.section}>
                <h3>Dados Bancários</h3>
                <p>{mockProfile.bankData}</p>
                <button style={styles.editButton}>Atualizar Dados Bancários</button>
            </div>

            <div style={styles.section}>
                <h3>Status do Currículo</h3>
                <p>Status: <strong>{mockProfile.cvStatus}</strong></p>
                <button style={styles.editButton}>Visualizar/Editar Currículo</button>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '30px', backgroundColor: 'white', minHeight: '100%' },
    title: { borderBottom: '2px solid #ddd', paddingBottom: '10px', marginBottom: '30px', color: '#343a40' },
    section: { marginBottom: '30px', padding: '15px', border: '1px solid #eee', borderRadius: '5px' },
    editButton: { padding: '8px 15px', backgroundColor: '#364fab', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' },
};

export default ProfilePanel;