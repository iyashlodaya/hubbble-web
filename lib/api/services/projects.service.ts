/**
 * Clients API service
 */

import { apiClient } from '../client';
import type { ApiResponse } from '../types';

// Request types
export interface CreateProjectsRequest {
    project_name: string;
    description?: string;
    project_status: string;
    client_id: number;
}

// Response types
export interface CreateProjectsResponse {
    id: number;
    client_id: number;
    name: string;
    description: string;
    status: string;
    public_slug: string;
    created_at: string;
    updated_at: string;
}

export interface ListProjectResponse {
    id: number;
    client: {
        name: string;
        id: number;
    },
    description: string;
    name: string;
    status: string;
    public_slug: string;
    created_at: string;
    updated_at: string;
}

/**
 * Create client
 */
export const createProjects = async (clientObj: CreateProjectsRequest): Promise<ApiResponse<CreateProjectsResponse>> => {
    const response = await apiClient.post<ApiResponse<CreateProjectsResponse>>('/projects', clientObj);

    return response.data;
};


/**
 * List Projects for Logged In user.
    */
export const listProjects = async (): Promise<ApiResponse<ListProjectResponse[]>> => {
    const response = await apiClient.get<ApiResponse<ListProjectResponse[]>>('/projects');

    return response.data;
};



