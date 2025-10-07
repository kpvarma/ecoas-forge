import { Template } from '../../types';

export let mockTemplates: Template[] = [
  {
    id: '1',
    template_code: 'TMPL-IPA-001',
    part_no: 'ONBOARDING-001',
    xml_file: '<template><name>Onboarding Template</name><description>Standard template for new employee onboarding process.</description></template>',
    created_at: '2023-01-15T10:00:00Z',
    status: 'active',
  },
  {
    id: '2',
    template_code: 'TMPL-ACE-001',
    part_no: 'OFFBOARDING-001',
    xml_file: '<template><name>Offboarding Template</name><description>Template for employee offboarding procedures.</description></template>',
    created_at: '2023-02-20T11:30:00Z',
    status: 'active',
  },
  {
    id: '3',
    template_code: 'TMPL-MET-001',
    part_no: 'PROJECT-KICKOFF-001',
    xml_file: '<template><name>Project Kickoff Template</name><description>Template for initiating new projects.</description></template>',
    created_at: '2023-03-10T09:00:00Z',
    status: 'inactive',
  },
  {
    id: '4',
    template_code: 'TMPL-ETH-001',
    part_no: 'PERF-REVIEW-001',
    xml_file: '<template><name>Performance Review Template</name><description>Annual performance review template.</description></template>',
    created_at: '2023-04-01T14:00:00Z',
    status: 'archived',
  },
];

export const addMockTemplate = (template: Omit<Template, 'id' | 'created_at' | 'updated_at'>): Template => {
  const newTemplate: Template = {
    ...template,
    id: String(mockTemplates.length + 1),
    created_at: new Date().toISOString(),
    status: template.status || 'active',
  };
  mockTemplates.push(newTemplate);
  return newTemplate;
};

export const updateMockTemplate = (id: string, updates: Partial<Omit<Template, 'id' | 'created_at'>>): Template | undefined => {
  const index = mockTemplates.findIndex(template => template.id === id);
  if (index > -1) {
    const updatedTemplate = { ...mockTemplates[index], ...updates, updated_at: new Date().toISOString() };
    mockTemplates[index] = updatedTemplate;
    return updatedTemplate;
  }
  return undefined;
};