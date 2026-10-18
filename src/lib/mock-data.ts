import { InstagramAccount, Automation, MessageLog, ConversationThread, Template } from '@/types';

// Zero fake data - initial real-time empty state
export const INITIAL_DEMO_ACCOUNTS: InstagramAccount[] = [];

export const INITIAL_DEMO_AUTOMATIONS: Automation[] = [];

export const INITIAL_CONVERSATIONS: ConversationThread[] = [];

// Clean blueprint library (empty or standard starting templates if requested)
export const INITIAL_TEMPLATES: Template[] = [
  {
    id: 'tpl-1',
    name: 'Instant Pricing & Package Guide',
    category: 'PRICE_ENQUIRY',
    description: 'Instantly shares your price list and booking page when customers ask how much you charge.',
    configuration: {
      trigger_keywords: ['price', 'pricing', 'rates', 'how much', 'cost'],
      reply_text: 'Hey! Thanks for inquiring. Here is our up-to-date pricing guide and services overview: https://techiedmtool.com/pricing',
      action_type: 'SEND_LINK',
      link_url: 'https://techiedmtool.com/pricing',
      link_label: 'View Rate Card',
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'tpl-2',
    name: 'High-Value Lead & Discovery Call',
    category: 'LEAD_ENQUIRY',
    description: 'Prompts serious clients to book directly onto your calendar without back-and-forth messaging.',
    configuration: {
      trigger_keywords: ['call', 'consult', 'hire', 'work together', 'project'],
      reply_text: 'We would love to talk about your project! Grab a spot for a free 15-minute strategy session here: https://calendly.com',
      action_type: 'SEND_LINK',
      link_url: 'https://calendly.com',
      link_label: 'Schedule Call',
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'tpl-3',
    name: 'Viral Freebie & Lead Magnet Dispatch',
    category: 'CREATOR_RESOURCE',
    description: 'The golden creator workflow: automated delivery of cheat sheets, Notion templates, and presets.',
    configuration: {
      trigger_keywords: ['guide', 'freebie', 'template', 'resource', 'ebook'],
      reply_text: 'Here is your direct download access link! Enjoy it and tag me in your stories with what you build:',
      action_type: 'SEND_LINK',
      link_url: 'https://techiedmtool.com/freebie',
      link_label: 'Download Playbook',
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'tpl-4',
    name: 'Business Hours & Studio Location',
    category: 'BUSINESS_HOURS',
    description: 'Gives instant answers on store opening hours, location address, and emergency support.',
    configuration: {
      trigger_keywords: ['hours', 'open', 'timing', 'address', 'where are you'],
      reply_text: 'We are open Monday to Friday from 9 AM to 6 PM EST. You can visit our studio at 450 Lexington Ave, Suite 1200.',
      action_type: 'SEND_DM',
    },
    created_at: new Date().toISOString(),
  },
];
