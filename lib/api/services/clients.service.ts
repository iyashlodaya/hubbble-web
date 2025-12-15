/**
 * Clients API service
 */

import { apiClient } from '../client';
import type { ApiResponse } from '../types';

// Request types
export interface CreateClientRequest {
    name: string;
    email?: string;
}

// Response types
export interface CreateClientResponse {
    id: number;
    user_id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface ListClientResponse {
    id: number;
    user_id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

/**
 * Create client
 */
export const createClient = async (clientObj: CreateClientRequest): Promise<ApiResponse<CreateClientResponse>> => {
    const response = await apiClient.post<ApiResponse<CreateClientResponse>>('/clients', clientObj);

    return response.data;
};


/**
 * List clients
 */
export const listClients = async (): Promise<ApiResponse<ListClientResponse[]>> => {
    const response = await apiClient.get<ApiResponse<ListClientResponse[]>>('/clients');

    return response.data;
};

