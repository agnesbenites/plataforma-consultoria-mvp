// web-consultor/src/components/Message.jsx

import React from 'react';

const Message = ({ message, currentUserId }) => {
    // Determina se a mensagem é do consultor atual (direita) ou do cliente (esquerda)
    const isMine = message.user_id === currentUserId;

    const messageStyle = {
        maxWidth: '70%',
        padding: '10px',
        borderRadius: '15px',
        marginBottom: '10px',
        wordWrap: 'break-word',
        float: isMine ? 'right' : 'left',
        clear: 'both',
        backgroundColor: isMine ? '#364fab' : '#e2e2e2',
        color: isMine ? 'white' : '#333',
    };

    return (
        <div style={messageStyle}>
            {message.content}
        </div>
    );
};

export default Message;