import { Responsibility, User } from '../../types';

export const mockUsers: User[] = [
  { id: "user-1", name: "John Smith", email: "john.smith@example.com", role: "Template Admin" },
  { id: "user-2", name: "Sarah Johnson", email: "sarah.johnson@example.com", role: "Superuser" },
  { id: "user-3", name: "Michael Brown", email: "michael.brown@example.com", role: "User" },
];

export const mockPartNumbers = [
  { id: "PN001", name: "PN001", description: "Engine Component A" },
  { id: "PN002", name: "PN002", description: "Brake System B" },
  { id: "PN003", name: "PN003", description: "Transmission C" },
  { id: "PN004", name: "PN004", description: "Steering Wheel D" },
  { id: "PN005", name: "PN005", description: "Suspension E" },
  { id: "PN006", name: "PN006", description: "Exhaust System F" },
  { id: "PN007", name: "PN007", description: "Air Filter G" },
  { id: "PN008", name: "PN008", description: "Oil Filter H" },
  { id: "PN009", name: "PN009", description: "Battery I" },
  { id: "PN010", name: "PN010", description: "Alternator J" },
  { id: "PN011", name: "PN011", description: "Radiator K" },
  { id: "PN012", name: "PN012", description: "Carburetor L" }
];

export const mockPlantIds = [
  { id: "P001", name: "P001", description: "Detroit Manufacturing" },
  { id: "P002", name: "P002", description: "Chicago Assembly" },
  { id: "P003", name: "P003", description: "Houston Production" },
  { id: "P004", name: "P004", description: "Phoenix Factory" },
  { id: "P005", name: "P005", description: "Atlanta Facility" }
];
 
export let mockResponsibilities: Responsibility[] = [
  {
    id: 'resp-1',
    user: mockUsers[0],
    part_number: 'PN001',
    plant_id: 'P001',
    status: 'active',
    created_at: '2023-01-01T10:00:00Z',
    updated_at: '2023-01-01T10:00:00Z',
  },
  {
    id: 'resp-2',
    user: mockUsers[1],
    part_number: 'PN002',
    plant_id: 'P002',
    status: 'active',
    created_at: '2023-02-01T11:00:00Z',
    updated_at: '2023-02-01T11:00:00Z',
  },
  {
    id: 'resp-3',
    user: mockUsers[2],
    part_number: 'PN003',
    plant_id: 'P003',
    status: 'inactive',
    created_at: '2023-03-01T12:00:00Z',
    updated_at: '2023-03-01T12:00:00Z',
  },
];

export const addMockResponsibility = (responsibility: Omit<Responsibility, 'id' | 'created_at' | 'updated_at'>): Responsibility => {
  const newResponsibility: Responsibility = {
    ...responsibility,
    id: `resp-${mockResponsibilities.length + 1}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockResponsibilities.push(newResponsibility);
  return newResponsibility;
};

export const updateMockResponsibility = (id: string, updates: Partial<Omit<Responsibility, 'id' | 'created_at'>>): Responsibility | undefined => {
  const index = mockResponsibilities.findIndex(resp => resp.id === id);
  if (index > -1) {
    const updatedResponsibility = { ...mockResponsibilities[index], ...updates, updated_at: new Date().toISOString() };
    mockResponsibilities[index] = updatedResponsibility;
    return updatedResponsibility;
  }
  return undefined;
};

export const deleteMockResponsibility = (id: string): boolean => {
  const initialLength = mockResponsibilities.length;
  mockResponsibilities = mockResponsibilities.filter(resp => resp.id !== id);
  return mockResponsibilities.length < initialLength;
};