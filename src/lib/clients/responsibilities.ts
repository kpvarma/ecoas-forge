import { Responsibility, CreateResponsibilityPayload, UpdateResponsibilityPayload, User } from '../../types';
import axios from 'axios';
import {
  mockResponsibilities,
  addMockResponsibility,
  updateMockResponsibility,
  deleteMockResponsibility,
  mockUsers,
  mockPartNumbers,
  mockPlantIds,
} from '../mock/responsibilities';

// Define your API base URL. In a real application, this would come from environment variables.
const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your actual API base URL

// Feature flag to control whether to use mock data
const USE_MOCK_DATA = false; // Set to true to use mock data, false to use API

const DELAY = 200; // Simulate network delay

export const responsibilitiesClient = {
  index: async (): Promise<Responsibility[]> => {
    if (USE_MOCK_DATA) {
      console.log("Using mock data for responsibilities index.");
      return mockResponsibilities;
    }
    try {
      const response = await axios.get<Responsibility[]>(`${API_BASE_URL}/responsibilities`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch responsibilities from API, falling back to mock data:", error);
      return mockResponsibilities; // Fallback to mock data on API error
    }
  },

  show: async (id: string): Promise<Responsibility | undefined> => {
    if (USE_MOCK_DATA) {
      console.log(`Using mock data for responsibility show with ID: ${id}`);
      return mockResponsibilities.find(responsibility => responsibility.id === id);
    }
    try {
      const response = await axios.get<Responsibility>(`${API_BASE_URL}/responsibilities/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch responsibility with ID ${id} from API, falling back to mock data:`, error);
      return mockResponsibilities.find(responsibility => responsibility.id === id); // Fallback to mock data on API error
    }
  },

  create: async (responsibility: CreateResponsibilityPayload): Promise<Responsibility> => {
    if (USE_MOCK_DATA) {
      console.log("Using mock data for responsibility creation.");
      return addMockResponsibility(responsibility);
    }
    try {
      const response = await axios.post<Responsibility>(`${API_BASE_URL}/responsibilities`, responsibility);
      return response.data;
    } catch (error) {
      console.error("Failed to create responsibility via API, falling back to mock data:", error);
      return addMockResponsibility(responsibility);
    }
  },

  update: async (id: string, updates: UpdateResponsibilityPayload): Promise<Responsibility | undefined> => {
    if (USE_MOCK_DATA) {
      console.log(`Using mock data for responsibility update with ID: ${id}`);
      return updateMockResponsibility(id, updates);
    }
    try {
      const response = await axios.put<Responsibility>(`${API_BASE_URL}/responsibilities/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error(`Failed to update responsibility with ID ${id} via API, falling back to mock data:`, error);
      return updateMockResponsibility(id, updates);
    }
  },

  delete: async (id: string): Promise<boolean> => {
    if (USE_MOCK_DATA) {
      console.log(`Using mock data for responsibility deletion with ID: ${id}`);
      return deleteMockResponsibility(id);
    }
    try {
      await axios.delete(`${API_BASE_URL}/responsibilities/${id}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete responsibility with ID ${id} via API, falling back to mock data:`, error);
      return deleteMockResponsibility(id);
    }
  },

  getUsers: async (): Promise<User[]> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockUsers);
        }, DELAY);
      });
    }
    // In a real application, you would fetch this from your API
    console.warn("API call for getUsers not implemented, using mock data.");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUsers);
      }, DELAY);
    });
  },

  getPartNumbers: async (): Promise<{ id: string; name: string; description: string }[]> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockPartNumbers);
        }, DELAY);
      });
    }
    console.warn("API call for getPartNumbers not implemented, using mock data.");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockPartNumbers);
      }, DELAY);
    });
  },

  getPlantIds: async (): Promise<{ id: string; name: string; description: string }[]> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockPlantIds);
        }, DELAY);
      });
    }
    console.warn("API call for getPlantIds not implemented, using mock data.");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockPlantIds);
      }, DELAY);
    });
  },
};