// src/services/api.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../utils/constants';

// Função auxiliar para fazer requisições autenticadas
const authFetch = async (endpoint, options = {}) => {
  const token = await AsyncStorage.getItem('@CompraSmartCliente:token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  return data;
};

// ==================== BUSCA ====================

// Buscar por produto
export const buscarPorProduto = async (termo, latitude, longitude, raioKm = 10) => {
  try {
    const params = new URLSearchParams({
      termo,
      latitude,
      longitude,
      raio: raioKm,
    });
    
    return await authFetch(`/cliente/busca/produto?${params}`);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return { success: false, error: 'Erro ao buscar produto' };
  }
};

// Buscar por segmento
export const buscarPorSegmento = async (segmentoId, latitude, longitude, raioKm = 10) => {
  try {
    const params = new URLSearchParams({
      segmentoId,
      latitude,
      longitude,
      raio: raioKm,
    });
    
    return await authFetch(`/cliente/busca/segmento?${params}`);
  } catch (error) {
    console.error('Erro ao buscar segmento:', error);
    return { success: false, error: 'Erro ao buscar segmento' };
  }
};

// Buscar lojas próximas
export const buscarLojasProximas = async (latitude, longitude, raioKm = 10, segmentos = []) => {
  try {
    const params = new URLSearchParams({
      latitude,
      longitude,
      raio: raioKm,
    });
    
    if (segmentos.length > 0) {
      params.append('segmentos', segmentos.join(','));
    }
    
    return await authFetch(`/cliente/lojas/proximas?${params}`);
  } catch (error) {
    console.error('Erro ao buscar lojas:', error);
    return { success: false, error: 'Erro ao buscar lojas' };
  }
};

// ==================== LOJAS ====================

// Obter detalhes da loja
export const obterLoja = async (lojaId) => {
  try {
    return await authFetch(`/cliente/lojas/${lojaId}`);
  } catch (error) {
    console.error('Erro ao obter loja:', error);
    return { success: false, error: 'Erro ao obter loja' };
  }
};

// Obter catálogo da loja
export const obterCatalogoLoja = async (lojaId, filtros = {}) => {
  try {
    const params = new URLSearchParams(filtros);
    return await authFetch(`/cliente/lojas/${lojaId}/catalogo?${params}`);
  } catch (error) {
    console.error('Erro ao obter catálogo:', error);
    return { success: false, error: 'Erro ao obter catálogo' };
  }
};

// Obter consultores disponíveis da loja
export const obterConsultoresLoja = async (lojaId) => {
  try {
    return await authFetch(`/cliente/lojas/${lojaId}/consultores`);
  } catch (error) {
    console.error('Erro ao obter consultores:', error);
    return { success: false, error: 'Erro ao obter consultores' };
  }
};

// ==================== ATENDIMENTO ====================

// Iniciar atendimento
export const iniciarAtendimento = async (lojaId, consultorId = null, produtoInteresse = null) => {
  try {
    return await authFetch('/cliente/atendimento/iniciar', {
      method: 'POST',
      body: JSON.stringify({ lojaId, consultorId, produtoInteresse }),
    });
  } catch (error) {
    console.error('Erro ao iniciar atendimento:', error);
    return { success: false, error: 'Erro ao iniciar atendimento' };
  }
};

// Obter atendimento atual
export const obterAtendimentoAtual = async () => {
  try {
    return await authFetch('/cliente/atendimento/atual');
  } catch (error) {
    console.error('Erro ao obter atendimento:', error);
    return { success: false, error: 'Erro ao obter atendimento' };
  }
};

// Finalizar atendimento
export const finalizarAtendimento = async (atendimentoId) => {
  try {
    return await authFetch(`/cliente/atendimento/${atendimentoId}/finalizar`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Erro ao finalizar atendimento:', error);
    return { success: false, error: 'Erro ao finalizar atendimento' };
  }
};

// Avaliar atendimento
export const avaliarAtendimento = async (atendimentoId, nota, comentario) => {
  try {
    return await authFetch(`/cliente/atendimento/${atendimentoId}/avaliar`, {
      method: 'POST',
      body: JSON.stringify({ nota, comentario }),
    });
  } catch (error) {
    console.error('Erro ao avaliar atendimento:', error);
    return { success: false, error: 'Erro ao avaliar atendimento' };
  }
};

// ==================== CARRINHO ====================

// Obter carrinho atual
export const obterCarrinho = async () => {
  try {
    return await authFetch('/cliente/carrinho');
  } catch (error) {
    console.error('Erro ao obter carrinho:', error);
    return { success: false, error: 'Erro ao obter carrinho' };
  }
};

// Adicionar produto ao carrinho
export const adicionarAoCarrinho = async (produtoId, quantidade = 1, lojaId) => {
  try {
    return await authFetch('/cliente/carrinho/adicionar', {
      method: 'POST',
      body: JSON.stringify({ produtoId, quantidade, lojaId }),
    });
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error);
    return { success: false, error: 'Erro ao adicionar ao carrinho' };
  }
};

// Atualizar quantidade do produto no carrinho
export const atualizarQuantidadeCarrinho = async (itemId, quantidade) => {
  try {
    return await authFetch(`/cliente/carrinho/item/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantidade }),
    });
  } catch (error) {
    console.error('Erro ao atualizar carrinho:', error);
    return { success: false, error: 'Erro ao atualizar carrinho' };
  }
};

// Remover produto do carrinho
export const removerDoCarrinho = async (itemId) => {
  try {
    return await authFetch(`/cliente/carrinho/item/${itemId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Erro ao remover do carrinho:', error);
    return { success: false, error: 'Erro ao remover do carrinho' };
  }
};

// Limpar carrinho
export const limparCarrinho = async () => {
  try {
    return await authFetch('/cliente/carrinho/limpar', {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Erro ao limpar carrinho:', error);
    return { success: false, error: 'Erro ao limpar carrinho' };
  }
};

// Reservar produtos (finalizar pedido para retirada)
export const reservarProdutos = async (lojaId, observacoes = '') => {
  try {
    return await authFetch('/cliente/carrinho/reservar', {
      method: 'POST',
      body: JSON.stringify({ lojaId, observacoes }),
    });
  } catch (error) {
    console.error('Erro ao reservar produtos:', error);
    return { success: false, error: 'Erro ao reservar produtos' };
  }
};

// ==================== HISTÓRICO ====================

// Obter histórico de compras
export const obterHistoricoCompras = async (pagina = 1, limite = 20) => {
  try {
    const params = new URLSearchParams({ pagina, limite });
    return await authFetch(`/cliente/historico/compras?${params}`);
  } catch (error) {
    console.error('Erro ao obter histórico:', error);
    return { success: false, error: 'Erro ao obter histórico' };
  }
};

// Obter detalhes de uma compra
export const obterDetalhesCompra = async (compraId) => {
  try {
    return await authFetch(`/cliente/historico/compras/${compraId}`);
  } catch (error) {
    console.error('Erro ao obter detalhes da compra:', error);
    return { success: false, error: 'Erro ao obter detalhes' };
  }
};

// ==================== NOTIFICAÇÕES ====================

// Obter notificações
export const obterNotificacoes = async (pagina = 1, limite = 20) => {
  try {
    const params = new URLSearchParams({ pagina, limite });
    return await authFetch(`/cliente/notificacoes?${params}`);
  } catch (error) {
    console.error('Erro ao obter notificações:', error);
    return { success: false, error: 'Erro ao obter notificações' };
  }
};

// Marcar notificação como lida
export const marcarNotificacaoLida = async (notificacaoId) => {
  try {
    return await authFetch(`/cliente/notificacoes/${notificacaoId}/lida`, {
      method: 'PUT',
    });
  } catch (error) {
    console.error('Erro ao marcar notificação:', error);
    return { success: false, error: 'Erro ao marcar notificação' };
  }
};

// Registrar token de push notification
export const registrarTokenPush = async (token) => {
  try {
    return await authFetch('/cliente/notificacoes/token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  } catch (error) {
    console.error('Erro ao registrar token:', error);
    return { success: false, error: 'Erro ao registrar token' };
  }
};

// ==================== PROMOÇÕES ====================

// Obter promoções
export const obterPromocoes = async (latitude, longitude, segmentos = []) => {
  try {
    const params = new URLSearchParams({ latitude, longitude });
    if (segmentos.length > 0) {
      params.append('segmentos', segmentos.join(','));
    }
    return await authFetch(`/cliente/promocoes?${params}`);
  } catch (error) {
    console.error('Erro ao obter promoções:', error);
    return { success: false, error: 'Erro ao obter promoções' };
  }
};

export default {
  buscarPorProduto,
  buscarPorSegmento,
  buscarLojasProximas,
  obterLoja,
  obterCatalogoLoja,
  obterConsultoresLoja,
  iniciarAtendimento,
  obterAtendimentoAtual,
  finalizarAtendimento,
  avaliarAtendimento,
  obterCarrinho,
  adicionarAoCarrinho,
  atualizarQuantidadeCarrinho,
  removerDoCarrinho,
  limparCarrinho,
  reservarProdutos,
  obterHistoricoCompras,
  obterDetalhesCompra,
  obterNotificacoes,
  marcarNotificacaoLida,
  registrarTokenPush,
  obterPromocoes,
};