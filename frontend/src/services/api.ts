import axios from 'axios';

const API_BASE_URL = '/api';

export interface Sweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSweetData {
  name: string;
  category: string;
  price: number;
  quantity?: number;
}

export interface UpdateSweetData {
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
}

export const sweetService = {
  getAll: async (): Promise<Sweet[]> => {
    const response = await axios.get(`${API_BASE_URL}/sweets`);
    return response.data.sweets;
  },

  search: async (params: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Sweet[]> => {
    const queryParams = new URLSearchParams();
    if (params.name) queryParams.append('name', params.name);
    if (params.category) queryParams.append('category', params.category);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());

    const response = await axios.get(
      `${API_BASE_URL}/sweets/search?${queryParams.toString()}`
    );
    return response.data.sweets;
  },

  create: async (data: CreateSweetData): Promise<Sweet> => {
    const response = await axios.post(`${API_BASE_URL}/sweets`, data);
    return response.data.sweet;
  },

  update: async (id: string, data: UpdateSweetData): Promise<Sweet> => {
    const response = await axios.put(`${API_BASE_URL}/sweets/${id}`, data);
    return response.data.sweet;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/sweets/${id}`);
  },

  purchase: async (id: string, quantity: number = 1): Promise<Sweet> => {
    const response = await axios.post(`${API_BASE_URL}/sweets/${id}/purchase`, {
      quantity,
    });
    return response.data.sweet;
  },

  restock: async (id: string, quantity: number): Promise<Sweet> => {
    const response = await axios.post(`${API_BASE_URL}/sweets/${id}/restock`, {
      quantity,
    });
    return response.data.sweet;
  },
};

