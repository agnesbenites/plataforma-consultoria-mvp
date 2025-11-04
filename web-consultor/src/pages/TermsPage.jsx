// web-consultor/src/pages/TermsPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsPage = () => {
  const navigate = useNavigate();

  const handleAccept = () => {
    // Armazena flag de aceite
    localStorage.setItem('termsAccepted', 'true');
    navigate('/register');
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Termos e Condições de Uso</h1>
        <p style={styles.paragraphIntro}>
          Antes de prosseguir com o cadastro como consultor, leia atentamente as informações abaixo. O aceite é obrigatório para continuar.
        </p>

        <h2 style={styles.sectionTitle}>1. Termos e Condições de Uso</h2>
        <p style={styles.paragraph}>
          Este documento define as regras de engajamento, segurança e confidencialidade aplicáveis a todos os consultores associados à Compra Smart.
        </p>

        <h2 style={styles.sectionTitle}>2. Dados Pessoais</h2>
        <p style={styles.paragraph}>
          O consultor reconhece que seus dados pessoais serão tratados conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD),
          exclusivamente para fins de análise de cadastro, verificação de identidade e processamento de pagamentos.
        </p>

        <h2 style={styles.sectionTitle}>3. Currículo</h2>
        <p style={styles.paragraph}>
          O consultor autoriza a análise de seu currículo por sistemas de Inteligência Artificial (IA) para fins de identificação de áreas de atuação
          e compatibilidade com lojas parceiras. As informações enviadas devem ser verdadeiras e atualizadas.
        </p>

        <h2 style={styles.sectionTitle}>4. Dados Bancários</h2>
        <p style={styles.paragraph}>
          As informações bancárias serão utilizadas exclusivamente para repasse de comissões e pagamentos referentes à atividade de consultoria,
          podendo ser alteradas posteriormente mediante autenticação.
        </p>

        <h2 style={styles.sectionTitle}>5. Segurança e Confidencialidade</h2>
        <p style={styles.paragraph}>
          É proibido compartilhar, copiar ou divulgar informações de clientes, lojas ou dados internos da plataforma fora dos canais oficiais.
          O descumprimento resultará em suspensão imediata e eventuais medidas legais.
        </p>

        <div style={styles.buttonsContainer}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>Voltar</button>
          <button onClick={handleAccept} style={styles.acceptButton}>Aceito os Termos e Quero Continuar</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', backgroundColor: '#f0f2f5', fontFamily: 'Arial, sans-serif', minHeight: '100vh' },
  content: { background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '800px', margin: '40px 0', minHeight: '80vh' },
  title: { color: '#364fab', borderBottom: '2px solid #ddd', paddingBottom: '10px', marginBottom: '30px' },
  paragraphIntro: { lineHeight: '1.6', color: '#333', marginBottom: '25px', borderLeft: '3px solid #ffc107', paddingLeft: '15px' },
  sectionTitle: { color: '#343a40', marginTop: '25px', marginBottom: '10px', fontWeight: 'bold' },
  paragraph: { lineHeight: '1.6', color: '#555', marginBottom: '15px' },
  buttonsContainer: { display: 'flex', justifyContent: 'space-between', marginTop: '40px' },
  backButton: { padding: '12px 25px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  acceptButton: { padding: '12px 25px', backgroundColor: '#1b3670', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
};

export default TermsPage;
