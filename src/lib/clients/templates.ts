import { Template } from '../../types';
import axios from 'axios';
import { mockTemplates, addMockTemplate, updateMockTemplate } from '../mock/templates'; // Import mock data

// Define your API base URL. In a real application, this would come from environment variables.
const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your actual API base URL

// Feature flag to control whether to use mock data
const USE_MOCK_DATA = false; // Set to true to use mock data, false to use API

export const templatesClient = {
  index: async (): Promise<Template[]> => {
    if (USE_MOCK_DATA) {
      console.log("Using mock data for templates index.");
      return mockTemplates;
    }
    try {
      const response = await axios.get<Template[]>(`${API_BASE_URL}/templates`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch templates from API, falling back to mock data:", error);
      return mockTemplates; // Fallback to mock data on API error
    }
  },

  show: async (id: string): Promise<Template | undefined> => {
    if (USE_MOCK_DATA) {
      console.log(`Using mock data for template show with ID: ${id}`);
      return mockTemplates.find(template => template.id === id);
    }
    try {
      const response = await axios.get<Template>(`${API_BASE_URL}/templates/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch template with ID ${id} from API, falling back to mock data:`, error);
      return mockTemplates.find(template => template.id === id); // Fallback to mock data on API error
    }
  },

  create: async (template: Omit<Template, 'id' | 'created_at' | 'updated_at'>): Promise<Template> => {
    if (USE_MOCK_DATA) {
      console.log("Using mock data for template creation.");
      return addMockTemplate(template);
    }
    try {
      const response = await axios.post<Template>(`${API_BASE_URL}/templates`, template);
      return response.data;
    } catch (error) {
      console.error("Failed to create template via API, falling back to mock data:", error);
      return addMockTemplate(template);
    }
  },

  update: async (id: string, updates: Partial<Omit<Template, 'id' | 'created_at'>>): Promise<Template | undefined> => {
    if (USE_MOCK_DATA) {
      console.log(`Using mock data for template update with ID: ${id}`);
      return updateMockTemplate(id, updates);
    }
    try {
      const response = await axios.put<Template>(`${API_BASE_URL}/templates/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error(`Failed to update template with ID ${id} via API, falling back to mock data:`, error);
      return updateMockTemplate(id, updates);
    }
  },
};