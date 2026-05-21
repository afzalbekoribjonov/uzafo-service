export interface Client {
  id: string;
  name: string;
  slug: string;
  phone: string;
  email?: string;
  createdAt: string;
}

export type ProjectType = 'web' | 'bot' | 'mobile' | 'llm' | 'other';
export type PaymentCycle = 'monthly' | 'annual';
export type PaymentStatus = 'paid' | 'due-soon' | 'overdue';

export interface ProjectLead {
  name: string;
  phone: string;
}

export interface ServerInfo {
  email?: string;
  password?: string;
  location?: string;
}

export interface Repos {
  frontend?: string;
  backend?: string;
}

export interface Hosting {
  frontend?: string;
  backend?: string;
}

export interface Payment {
  id: string;
  projectId: string;
  amount: number;
  currency: 'UZS' | 'USD';
  cycle: PaymentCycle;
  paidAt: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  type: ProjectType;
  paymentCycle: PaymentCycle;
  lead: ProjectLead;
  server: ServerInfo;
  repos: Repos;
  hosting: Hosting;
  payments: Payment[];
  createdAt: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface Message {
  id: string;
  email: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  web: 'Web',
  bot: 'Bot',
  mobile: 'Mobil',
  llm: 'LLM',
  other: 'Boshqalar',
};

export const PAYMENT_CYCLE_LABELS: Record<PaymentCycle, string> = {
  monthly: 'Oylik',
  annual: 'Yillik',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  paid: "To'langan",
  'due-soon': 'Tez orada',
  overdue: "Muddati o'tgan",
};
