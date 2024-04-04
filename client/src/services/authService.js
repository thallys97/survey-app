import axios from '../api/axiosInstance';

const authService = {
  login: () => {
    // Redireciona o usuário para a rota de autenticação do Google no back-end
    window.location.href = `${axios.defaults.baseURL}/auth/google`;
  },

  fetchCurrentUser: async () => {
    // Busca o usuário atualmente autenticado
    try {
      const response = await axios.get('/auth/current_user');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar o usuário atual', error);
      return null;
    }
  },

  logout: async () => {
    // Encerra a sessão do usuário
    try {
      await axios.get('/auth/logout');
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao encerrar sessão', error);
    }
  }
};

export default authService;
