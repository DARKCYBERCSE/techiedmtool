import { testKeywordMatch, evaluateAutomationRules } from './engine';
import { Automation } from '@/types';

describe('Automation Rule Matching Engine', () => {
  test('Exact match condition', () => {
    expect(testKeywordMatch('price', 'price', 'EXACT')).toBe(true);
    expect(testKeywordMatch('what is the price?', 'price', 'EXACT')).toBe(false);
  });

  test('Contains keyword condition (case-insensitive)', () => {
    expect(testKeywordMatch('Hey, can you send the GUIDE please?', 'guide', 'CONTAINS')).toBe(true);
    expect(testKeywordMatch('Hello there', 'guide', 'CONTAINS')).toBe(false);
  });

  test('Starts with keyword condition', () => {
    expect(testKeywordMatch('consultation needed', 'consult', 'STARTS_WITH')).toBe(true);
    expect(testKeywordMatch('need consultation', 'consult', 'STARTS_WITH')).toBe(false);
  });

  test('evaluateAutomationRules triggers correct reply for active automation', () => {
    const mockAutomations: Automation[] = [
      {
        id: 'auto-test',
        user_id: 'u1',
        instagram_account_id: 'acc-1',
        name: 'Price responder',
        trigger_type: 'KEYWORD_MATCH',
        status: 'ACTIVE',
        configuration: {
          trigger: { type: 'KEYWORD_MATCH' },
          conditions: [
            {
              id: 'c1',
              type: 'KEYWORD',
              matchType: 'CONTAINS',
              keywords: ['price', 'pricing'],
            },
          ],
          actions: [
            {
              id: 'a1',
              type: 'SEND_DM',
              content: 'Our rates start at $99.',
            },
          ],
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const result = evaluateAutomationRules(
      {
        senderId: 'user_123',
        senderUsername: 'shopper',
        text: 'What is your pricing?',
        instagramAccountId: 'acc-1',
      },
      mockAutomations
    );

    expect(result.matched).toBe(true);
    expect(result.replyText).toBe('Our rates start at $99.');
  });
});
