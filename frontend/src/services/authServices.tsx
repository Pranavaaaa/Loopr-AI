import api from './api';

export const loginService = async (email: string, password: string) => {
  try {
    console.log("email & password received:  ", email, password);

    const response = await api.post('/users/login', { email, password });
    
    // Store token and user info
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    console.log("response in authservice: ", response.data);
    
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Login failed');
  }
};

interface RegisterUserData {
  fullname: {
    firstname: string;
    lastname: string;
  };
  email: string;
  password: string;
}

export const register = async (userData: RegisterUserData) => {
  try {
    const response = await api.post('/users/register', userData);
    return response.data;

  } catch (err: any) {
    throw err.response ? err.response.data : new Error('Registration failed');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return null;
  }
};
