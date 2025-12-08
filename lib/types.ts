export interface Estimate {
    id: string;
    title: string;
    date: string;
    total: number;
}

export interface UserData {
    fullName: string;
    address: string;
    city: string;
    state: string;
    phone: string;
    email: string;
    userType: string;
}

export interface Lead {
    type: 'provider' | 'client';
    name: string;
    whatsapp: string;
    timestamp: string;
    projectType?: string;
    ddd?: string;
    state?: string;
    region?: string;
    deadline?: string;
    count?: number;
}
