export type InstagramAccountType = 'BUSINESS' | 'CREATOR' | 'PERSONAL';
export type ConnectionStatus = 'CONNECTED' | 'EXPIRED' | 'DISCONNECTED' | 'ERROR';

export interface InstagramAccount {
  id: string;
  user_id: string;
  external_account_id: string;
  username: string;
  name?: string;
  profile_picture_url?: string;
  account_type: InstagramAccountType;
  connection_status: ConnectionStatus;
  access_token?: string;
  token_expires_at?: string;
  created_at: string;
  updated_at: string;
}

export type TriggerType = 'INCOMING_MESSAGE' | 'KEYWORD_MATCH' | 'POST_COMMENT' | 'STORY_REPLY';
export type WorkflowStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ERROR';

export type KeywordMatchType = 'EXACT' | 'CONTAINS' | 'STARTS_WITH';

export interface WorkflowCondition {
  id: string;
  type: 'KEYWORD' | 'ACCOUNT' | 'MEDIA_TYPE';
  matchType?: KeywordMatchType;
  keywords?: string[];
  operator?: 'AND' | 'OR';
}

export interface WorkflowAction {
  id: string;
  type: 'SEND_DM' | 'SEND_LINK' | 'USE_TEMPLATE' | 'STOP_PROCESSING';
  content?: string;
  linkUrl?: string;
  linkLabel?: string;
  templateId?: string;
  delaySeconds?: number;
}

export interface AutomationWorkflowConfig {
  trigger: {
    type: TriggerType;
    postUrlOrId?: string;
  };
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  stats?: {
    triggeredCount: number;
    repliedCount: number;
    failedCount: number;
    lastExecutedAt?: string;
  };
}

export interface Automation {
  id: string;
  user_id: string;
  instagram_account_id: string;
  name: string;
  description?: string;
  trigger_type: TriggerType;
  configuration: AutomationWorkflowConfig;
  status: WorkflowStatus;
  created_at: string;
  updated_at: string;
}

export interface MessageLog {
  id: string;
  user_id: string;
  instagram_account_id: string;
  automation_id?: string;
  direction: 'INBOUND' | 'OUTBOUND';
  external_message_id?: string;
  sender_username: string;
  sender_avatar?: string;
  content: string;
  status: 'DELIVERED' | 'FAILED' | 'PENDING' | 'TRIGGERED';
  error_code?: string;
  error_message?: string;
  created_at: string;
}

export interface ConversationThread {
  id: string;
  instagram_account_id: string;
  sender_username: string;
  sender_name?: string;
  sender_avatar?: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  automation_active: boolean;
  messages: MessageLog[];
}

export interface Template {
  id: string;
  user_id?: string | null; // null for system templates
  name: string;
  category: 'PRICE_ENQUIRY' | 'PRODUCT_INFO' | 'LEAD_ENQUIRY' | 'FAQ' | 'BUSINESS_HOURS' | 'CREATOR_RESOURCE';
  description: string;
  configuration: {
    trigger_keywords: string[];
    reply_text: string;
    action_type: 'SEND_DM' | 'SEND_LINK';
    link_url?: string;
    link_label?: string;
  };
  created_at: string;
}

export interface SubscriptionPlan {
  id: 'free' | 'pro' | 'agency';
  name: string;
  priceMonthly: number;
  priceYearly: number;
  dmsPerMonth: number;
  accountsLimit: number;
  features: string[];
}

export interface UpiPaymentVerification {
  id: string;
  userEmail: string;
  userName: string;
  utrNumber: string;
  planId: 'pro' | 'agency';
  planName: string;
  amountINR: number;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  submittedAt: string;
  verifiedAt?: string;
}

