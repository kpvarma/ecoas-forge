import { Template } from '../../types';
import { mockTemplates } from '../mock/templates';

export const templatesClient = {
  index: async (): Promise<Template[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTemplates);
      }, 500); // Simulate network delay
    });
  },

  show: async (id: string): Promise<Template | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTemplates.find((template) => template.id === id));
      }, 500); // Simulate network delay
    });
  },
};