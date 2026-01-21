// Frontend API client to talk to the backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const analyzeVision = async (vision: string) => {
  const response = await fetch(`${API_URL}/onboarding/vision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vision }),
  });
  if (!response.ok) throw new Error('Failed to analyze vision');
  return response.json();
};

export const decomposeGoal = async (goalTitle: string, domainName: string) => {
  const response = await fetch(`${API_URL}/onboarding/goals/decompose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goalTitle, domainName, userId: 'temp-user' }),
  });
  if (!response.ok) throw new Error('Failed to decompose goal');
  return response.json();
};

export const saveDomains = async (domains: any[]) => {
  const response = await fetch(`${API_URL}/onboarding/domains`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'temp-user', domains }),
  });
  if (!response.ok) throw new Error('Failed to save domains');
  return response.json();
};

export const saveGoalPlan = async (domainId: string, goalTitle: string, milestones: any[], todos: any[]) => {
  const response = await fetch(`${API_URL}/onboarding/goals/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        userId: 'temp-user',
        domainId,
        goalTitle,
        milestones,
        todos
    }),
  });
  if (!response.ok) throw new Error('Failed to save goal plan');
  return response.json();
};
