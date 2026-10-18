import { Automation, KeywordMatchType } from '@/types';

export interface IncomingEvent {
  senderId: string;
  senderUsername: string;
  text: string;
  instagramAccountId: string;
  isComment?: boolean;
}

export interface MatchResult {
  matched: boolean;
  automation?: Automation;
  replyText?: string;
  actionType?: string;
  linkUrl?: string;
  linkLabel?: string;
}

export function testKeywordMatch(
  inputText: string,
  keyword: string,
  matchType: KeywordMatchType = 'CONTAINS'
): boolean {
  const cleanInput = inputText.trim().toLowerCase();
  const cleanKw = keyword.trim().toLowerCase();

  if (!cleanKw) return false;

  switch (matchType) {
    case 'EXACT':
      return cleanInput === cleanKw;
    case 'STARTS_WITH':
      return cleanInput.startsWith(cleanKw);
    case 'CONTAINS':
    default:
      return cleanInput.includes(cleanKw);
  }
}

export function evaluateAutomationRules(
  event: IncomingEvent,
  automations: Automation[]
): MatchResult {
  const activeAutomations = automations.filter(
    (a) => a.status === 'ACTIVE' && (!a.instagram_account_id || a.instagram_account_id === event.instagramAccountId)
  );

  for (const auto of activeAutomations) {
    const config = auto.configuration;
    if (!config) continue;

    // Trigger match
    if (auto.trigger_type === 'POST_COMMENT' && !event.isComment) continue;
    if (auto.trigger_type === 'INCOMING_MESSAGE' && event.isComment) continue;

    // Check conditions
    let passesConditions = true;

    if (config.conditions && config.conditions.length > 0) {
      for (const condition of config.conditions) {
        if (condition.type === 'KEYWORD' && condition.keywords && condition.keywords.length > 0) {
          const matchType = condition.matchType || 'CONTAINS';
          const anyKeywordMatches = condition.keywords.some((kw) =>
            testKeywordMatch(event.text, kw, matchType)
          );

          if (!anyKeywordMatches) {
            passesConditions = false;
            break;
          }
        }
      }
    }

    if (passesConditions) {
      // Find first executable send action
      const action = config.actions?.find(
        (a) => a.type === 'SEND_DM' || a.type === 'SEND_LINK' || a.type === 'USE_TEMPLATE'
      );

      if (action) {
        return {
          matched: true,
          automation: auto,
          replyText: action.content || '',
          actionType: action.type,
          linkUrl: action.linkUrl,
          linkLabel: action.linkLabel,
        };
      }
    }
  }

  return { matched: false };
}
