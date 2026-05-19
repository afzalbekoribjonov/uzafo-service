import { create } from 'zustand';
import api from '@/lib/api';
import type { Client, Project, Payment, PaymentStatus, Message } from '@/types';

interface DataStore {
  clients: Client[];
  projects: Project[];
  messages: Message[];
  loading: boolean;
  error: string | null;
  
  // Fetching
  fetchData: () => Promise<void>;
  
  // Client CRUD
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Promise<void>;
  updateClient: (id: string, data: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  
  // Project CRUD
  addProject: (project: any) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  
  // Payment
  addPayment: (projectId: string, payment: any) => Promise<void>;
  updatePayment: (id: string, projectId: string, payment: any) => Promise<void>;
  deletePayment: (id: string, projectId: string) => Promise<void>;
  
  // Messages
  addMessage: (message: Omit<Message, 'id' | 'isRead' | 'createdAt'>) => Promise<void>;
  markMessageAsRead: (id: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  
  // Getters (synchronous from state)
  getClientById: (id: string) => Client | undefined;
  getProjectById: (id: string) => Project | undefined;
  getClientName: (clientId: string) => string;
  getPaymentsForProject: (projectId: string) => Payment[];
  getNextDueDate: (projectId: string) => Date | null;
  getPaymentStatus: (projectId: string) => PaymentStatus;
  getOverdueProjects: () => Project[];
  getDueSoonProjects: () => Project[];
  getProjectCountForClient: (clientId: string) => number;
  getUnreadMessageCount: () => number;
}

export const useDataStore = create<DataStore>((set, get) => ({
  clients: [],
  projects: [],
  messages: [],
  loading: false,
  error: null,

  fetchData: async () => {
    set({ loading: true });
    try {
      const [clientsRes, projectsRes, messagesRes] = await Promise.all([
        api.get('/clients'),
        api.get('/projects'),
        api.get('/messages')
      ]);
      
      const normalizedProjects = projectsRes.data.map((p: any) => ({
        ...p,
        clientId: p.client_id,
        paymentCycle: p.payment_cycle,
        payments: p.payments?.map((pay: any) => ({
          ...pay,
          paidAt: pay.paid_at
        })) || []
      }));

      const normalizedMessages = messagesRes.data.map((m: any) => ({
        ...m,
        isRead: m.is_read
      }));

      set({ 
        clients: clientsRes.data, 
        projects: normalizedProjects, 
        messages: normalizedMessages,
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addClient: async (client) => {
    try {
      const res = await api.post('/clients', client);
      set((state) => ({ clients: [res.data, ...state.clients] }));
    } catch (error) {
      console.error('Add client error:', error);
    }
  },

  updateClient: async (id, data) => {
    try {
      const res = await api.put(`/clients/${id}`, data);
      set((state) => ({
        clients: state.clients.map((c) => (c.id === id ? res.data : c)),
      }));
    } catch (error) {
      console.error('Update client error:', error);
    }
  },

  deleteClient: async (id) => {
    try {
      await api.delete(`/clients/${id}`);
      set((state) => ({
        clients: state.clients.filter((c) => c.id !== id),
        projects: state.projects.filter((p) => p.clientId !== id),
      }));
    } catch (error) {
      console.error('Delete client error:', error);
    }
  },

  addProject: async (project) => {
    try {
      const backendProject = {
        name: project.name,
        client_id: project.clientId,
        type: project.type,
        payment_cycle: project.paymentCycle || 'monthly',
        lead: project.lead,
        server: project.server,
        repos: project.repos,
        hosting: project.hosting
      };
      const res = await api.post('/projects', backendProject);
      const normalized = { 
        ...res.data, 
        clientId: res.data.client_id, 
        paymentCycle: res.data.payment_cycle,
        payments: [] 
      };
      set((state) => ({ projects: [normalized, ...state.projects] }));
    } catch (error) {
      console.error('Add project error:', error);
      throw error;
    }
  },

  updateProject: async (id, data) => {
    try {
      const backendProject = {
        name: data.name,
        client_id: data.clientId,
        type: data.type,
        payment_cycle: data.paymentCycle,
        lead: data.lead,
        server: data.server,
        repos: data.repos,
        hosting: data.hosting
      };
      const res = await api.put(`/projects/${id}`, backendProject);
      const normalized = { 
        ...res.data, 
        clientId: res.data.client_id,
        paymentCycle: res.data.payment_cycle
      };
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? { ...p, ...normalized } : p)),
      }));
    } catch (error) {
      console.error('Update project error:', error);
      throw error;
    }
  },

  deleteProject: async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
      }));
    } catch (error) {
      console.error('Delete project error:', error);
    }
  },

  addPayment: async (projectId, payment) => {
    try {
      const project = get().projects.find(p => p.id === projectId);
      const backendPayment = {
        project_id: projectId,
        amount: payment.amount,
        currency: payment.currency || 'UZS',
        cycle: payment.cycle || project?.paymentCycle || 'monthly',
        paid_at: payment.paidAt
      };
      const res = await api.post('/payments', backendPayment);
      const normalizedPayment = { ...res.data, paidAt: res.data.paid_at };
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId ? { ...p, payments: [normalizedPayment, ...(p.payments || [])] } : p
        ),
      }));
    } catch (error) {
      console.error('Add payment error:', error);
    }
  },

  updatePayment: async (id, projectId, payment) => {
    try {
      const backendPayment = {
        amount: payment.amount,
        currency: payment.currency,
        cycle: payment.cycle,
        paid_at: payment.paidAt
      };
      const res = await api.put(`/payments/${id}`, backendPayment);
      const normalizedPayment = { ...res.data, paidAt: res.data.paid_at };
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId 
            ? { ...p, payments: p.payments.map(pay => pay.id === id ? normalizedPayment : pay) } 
            : p
        ),
      }));
    } catch (error) {
      console.error('Update payment error:', error);
    }
  },

  deletePayment: async (id, projectId) => {
    try {
      await api.delete(`/payments/${id}`);
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId 
            ? { ...p, payments: p.payments.filter(pay => pay.id !== id) } 
            : p
        ),
      }));
    } catch (error) {
      console.error('Delete payment error:', error);
    }
  },

  addMessage: async (message) => {
    try {
      const res = await api.post('/messages', message);
      const normalized = { ...res.data, isRead: res.data.is_read };
      set((state) => ({ messages: [normalized, ...state.messages] }));
    } catch (error) {
      console.error('Add message error:', error);
    }
  },

  markMessageAsRead: async (id) => {
    try {
      const res = await api.put(`/messages/${id}/read`);
      const normalized = { ...res.data, isRead: res.data.is_read };
      set((state) => ({
        messages: state.messages.map((m) => (m.id === id ? normalized : m)),
      }));
    } catch (error) {
      console.error('Mark message read error:', error);
    }
  },

  deleteMessage: async (id) => {
    try {
      await api.delete(`/messages/${id}`);
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== id),
      }));
    } catch (error) {
      console.error('Delete message error:', error);
    }
  },

  getClientById: (id) => get().clients.find((c) => c.id === id),
  getProjectById: (id) => get().projects.find((p) => p.id === id),
  getClientName: (clientId) => get().clients.find((c) => c.id === clientId)?.name || 'Noma\'lum',
  getPaymentsForProject: (projectId) => {
    const project = get().projects.find((p) => p.id === projectId);
    return project?.payments ? [...project.payments].sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()) : [];
  },
  getNextDueDate: (projectId) => {
    const project = get().projects.find((p) => p.id === projectId);
    if (!project || !project.payments || project.payments.length === 0) return null;
    const sortedPayments = [...project.payments].sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime());
    const lastPayment = sortedPayments[0];
    const nextDue = new Date(lastPayment.paidAt);
    if (lastPayment.cycle === 'monthly') {
      nextDue.setMonth(nextDue.getMonth() + 1);
    } else {
      nextDue.setFullYear(nextDue.getFullYear() + 1);
    }
    return nextDue;
  },
  getPaymentStatus: (projectId) => {
    const nextDue = get().getNextDueDate(projectId);
    if (!nextDue) return 'overdue';
    const now = new Date();
    const daysUntilDue = Math.ceil((nextDue.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue <= 5) return 'due-soon';
    return 'paid';
  },
  getOverdueProjects: () => {
    return get().projects.filter((p) => get().getPaymentStatus(p.id) === 'overdue');
  },
  getDueSoonProjects: () => {
    return get().projects.filter((p) => get().getPaymentStatus(p.id) === 'due-soon');
  },
  getProjectCountForClient: (clientId) => {
    return get().projects.filter((p) => p.clientId === clientId).length;
  },
  getUnreadMessageCount: () => {
    return get().messages.filter((m) => !m.isRead).length;
  },
}));

// Placeholder function to maintain compatibility if called elsewhere
export function initializeDemoData() {}

