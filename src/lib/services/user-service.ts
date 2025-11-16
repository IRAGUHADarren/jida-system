import axios from 'axios';
import {useQuery} from '@tanstack/svelte-query';

const API_URL = 'http://localhost:8080/api/users';

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
}

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  },

  createUser: async (user: User): Promise<User> => {
    const response = await axios.post(`${API_URL}/users`, user);
    return response.data;
  }
};