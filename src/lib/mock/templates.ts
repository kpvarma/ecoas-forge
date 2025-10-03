import { Template } from '../../types';

export const mockTemplates: Template[] = [
  {
    id: 'temp-1',
    part_no: 'ONBOARDING-001',
    xml_file: '<template><name>Onboarding Template</name><description>Standard template for new employee onboarding process.</description></template>',
    created_at: '2023-01-15T10:00:00Z',
    status: 'active',
  },
  {
    id: 'temp-2',
    part_no: 'OFFBOARDING-001',
    xml_file: '<template><name>Offboarding Template</name><description>Template for employee offboarding procedures.</description></template>',
    created_at: '2023-02-20T11:30:00Z',
    status: 'active',
  },
  {
    id: 'temp-3',
    part_no: 'PROJECT-KICKOFF-001',
    xml_file: '<template><name>Project Kickoff Template</name><description>Template for initiating new projects.</description></template>',
    created_at: '2023-03-10T09:00:00Z',
    status: 'inactive',
  },
  {
    id: 'temp-4',
    part_no: 'PERF-REVIEW-001',
    xml_file: '<template><name>Performance Review Template</name><description>Annual performance review template.</description></template>',
    created_at: '2023-04-01T14:00:00Z',
    status: 'archived',
  },
];