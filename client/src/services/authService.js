import axiosInstance from '../api/axiosInstance';

const authService = {
  login: () => {
    // Ainda redireciona para a rota de autenticação do Google no backend
    window.location.href = `${axiosInstance.defaults.baseURL}/auth/google`;
  },

  fetchCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/auth/current_user', {
        headers: {
          // Supõe que o token esteja armazenado no localStorage
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.log('Erro ao buscar o usuário atual', error);
      if (error.response && error.response.status === 401) {
        console.log('Usuário não está autenticado');
      }
      return null;
    }
  },

  logout: async () => {
    // Para deslogar, removemos o token do localStorage
    localStorage.removeItem('token');
    // Redireciona para a página de login ou home
    window.location.href = '/';
  },

  validateToken: async (token) => {
    try {
      const response = await axiosInstance.get('/auth/validate_token', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.log('Erro ao validar o token', error);
      return null;
    }
  }
};

export default authService;
