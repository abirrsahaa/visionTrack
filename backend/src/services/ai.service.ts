import { config } from '../config';
import { GoalDecomposition, DomainSuggestion } from '../types';

class AIService {
  private provider: string;
  private apiKey: string;

  constructor() {
    this.provider = config.ai.provider;
    this.apiKey = config.ai.apiKey;
  }

  async decomposeGoal(goalTitle: string, domainName: string): Promise<GoalDecomposition> {
    if (this.provider === 'mock') {
      return this.mockDecomposeGoal(goalTitle, domainName);
    }

    try {
        if (this.provider === 'claude') {
            return this.callClaudeForGoal(goalTitle, domainName);
        } else if (this.provider === 'openai') {
            return this.callOpenAIForGoal(goalTitle, domainName);
        }
    } catch (error) {
        console.error('AI Service Error (Decompose Goal):', error);
        // Fallback to mock on error to keep app usable
        return this.mockDecomposeGoal(goalTitle, domainName);
    }

    return this.mockDecomposeGoal(goalTitle, domainName);
  }

  async suggestDomains(lifeVision: string): Promise<DomainSuggestion[]> {
    if (this.provider === 'mock') {
      return this.mockSuggestDomains(lifeVision);
    }

    try {
        if (this.provider === 'claude') {
            return this.callClaudeForDomains(lifeVision);
        } else if (this.provider === 'openai') {
            return this.callOpenAIForDomains(lifeVision);
        }
    } catch (error) {
        console.error('AI Service Error (Suggest Domains):', error);
        return this.mockSuggestDomains(lifeVision);
    }

    return this.mockSuggestDomains(lifeVision);
  }

  // --- REAL IMPLEMENTATIONS ---

  private async callClaudeForGoal(goalTitle: string, domainName: string): Promise<GoalDecomposition> {
      // Placeholder for Claude API integration
      // Ideally use @anthropic-ai/sdk
      // This is structured to be production-ready logic
      const prompt = `Act as a career mentor. Break this goal into 4 quarterly milestones and 4 concrete monthly TODOs for the first quarter.
      Goal: ${goalTitle} (Domain: ${domainName}).
      Return JSON format matching: { milestones: [{title, sort_order}], todos: [{title, scheduled_week}] }`;

      console.log('Calling Claude API with prompt:', prompt);
      // const response = await anthropic.messages.create(...)
      // return JSON.parse(response.content[0].text);

      // Simulate async call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return this.mockDecomposeGoal(goalTitle, domainName);
  }

  private async callOpenAIForGoal(goalTitle: string, domainName: string): Promise<GoalDecomposition> {
      // Placeholder for OpenAI API integration
      const prompt = `Break the goal "${goalTitle}" in domain "${domainName}" into milestones and todos. Return JSON.`;
      console.log('Calling OpenAI API with prompt:', prompt);
      // const completion = await openai.chat.completions.create(...)
      // return JSON.parse(completion.choices[0].message.content);

      await new Promise(resolve => setTimeout(resolve, 1000));
      return this.mockDecomposeGoal(goalTitle, domainName);
  }

  private async callClaudeForDomains(vision: string): Promise<DomainSuggestion[]> {
      const prompt = `Analyze this life vision and suggest 3-5 domains: "${vision}". Return JSON array of {name, description, reasoning}`;
      console.log('Calling Claude API for domains');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return this.mockSuggestDomains(vision);
  }

  private async callOpenAIForDomains(vision: string): Promise<DomainSuggestion[]> {
      console.log('Calling OpenAI API for domains');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return this.mockSuggestDomains(vision);
  }

  // --- MOCK IMPLEMENTATIONS ---

  private mockDecomposeGoal(goalTitle: string, domainName: string): GoalDecomposition {
    console.log(`[AI Mock] Decomposing goal: "${goalTitle}" for domain: ${domainName}`);
    return {
      milestones: [
        { title: 'Research and Planning', sort_order: 1 },
        { title: 'Initial Execution Phase', sort_order: 2 },
        { title: 'Review and Refine', sort_order: 3 },
        { title: 'Final Achievement', sort_order: 4 },
      ],
      todos: [
        { title: `Define specific metrics for ${goalTitle}`, scheduled_week: 1 },
        { title: 'Gather necessary resources', scheduled_week: 1 },
        { title: 'First major action step', scheduled_week: 2 },
        { title: 'Check in with mentor/peer', scheduled_week: 3 },
      ],
    };
  }

  private mockSuggestDomains(lifeVision: string): DomainSuggestion[] {
    console.log(`[AI Mock] Analyzing vision: "${lifeVision}"`);
    // Simple keyword extraction for mock
    const domains: DomainSuggestion[] = [];
    const vision = lifeVision.toLowerCase();

    if (vision.includes('health') || vision.includes('fit') || vision.includes('run')) {
      domains.push({ name: 'Health', description: 'Physical and mental well-being', reasoning: 'You mentioned fitness keywords.' });
    }
    if (vision.includes('work') || vision.includes('career') || vision.includes('job') || vision.includes('money')) {
      domains.push({ name: 'Career', description: 'Professional growth and finance', reasoning: 'You mentioned career keywords.' });
    }
    if (vision.includes('learn') || vision.includes('study') || vision.includes('read')) {
      domains.push({ name: 'Learning', description: 'Skill acquisition and education', reasoning: 'You mentioned learning keywords.' });
    }

    // Default fallback
    if (domains.length === 0) {
      domains.push(
        { name: 'Health', description: 'Physical vitality', reasoning: 'Foundational for all goals.' },
        { name: 'Career', description: 'Professional success', reasoning: 'Standard life domain.' },
        { name: 'Relationships', description: 'Connection with others', reasoning: 'Essential for happiness.' }
      );
    }

    return domains;
  }
}

export const aiService = new AIService();
