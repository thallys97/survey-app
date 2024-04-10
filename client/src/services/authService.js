import axiosInstance from '../api/axiosInstance';

const authService = {
  login: () => {
    // Redireciona o usuário para a rota de autenticação do Google no back-end
    window.location.href = `${axiosInstance.defaults.baseURL}/auth/google`;
  },

  fetchCurrentUser: async () => {
    // Busca o usuário atualmente autenticado
    try {
      const response = await axiosInstance.get('/auth/current_user');
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Usuário não está autenticado
        console.log('Usuário não está autenticado');
        return null;
      } else {
        console.error('Erro ao buscar o usuário atual', error);
      }
    }
  },

  logout: async () => {
    // Encerra a sessão do usuário
    try {
      await axiosInstance.get('/auth/logout');
    } catch (error) {
      console.error('Erro ao encerrar sessão', error);
    }
  }
};

export default authService;
