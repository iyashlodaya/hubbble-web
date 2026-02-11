/**
 * Clients API service
 */

import { apiClient } from '../client';
import type { ApiResponse } from '../types';

// Request types
export type PortalStatus = 'active' | 'waiting' | 'completed';

export interface CreateProjectsRequest {
    project_name: string;
    description?: string;
    project_status: string;
    client_id: number;
}

// Response types
export interface ProjectUpdate {
    id: number;
    project_id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export interface ProjectFileLink {
    id: number;
    project_id: number;
    title: string;
    url: string;
    type: 'file' | 'link';
    file_size: number | null;
    mime_type: string | null;
    storage_path: string | null;
    created_at: string;
    updated_at: string;
}

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

export interface FreelancerBranding {
    id?: number;
    full_name: string;
    avatar_url: string | null;
    accent_color: string | null;
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
    freelancer?: FreelancerBranding;
    created_at: string;
    updated_at: string;
}

/**
 * Create project
 */
export const createProjects = async (projectObj: CreateProjectsRequest): Promise<ApiResponse<CreateProjectsResponse>> => {
    const response = await apiClient.post<ApiResponse<CreateProjectsResponse>>('/projects', projectObj);
    return response.data;
};

/**
 * List Projects for Logged In user
 */
export const listProjects = async (): Promise<ApiResponse<ListProjectResponse[]>> => {
    const response = await apiClient.get<ApiResponse<ListProjectResponse[]>>('/projects');
    return response.data;
};

/**
 * Get a single project by ID
 */
export const getProject = async (id: number): Promise<ApiResponse<ListProjectResponse>> => {
    const response = await apiClient.get<ApiResponse<ListProjectResponse>>(`/projects/${id}`);
    return response.data;
};

/**
 * Update a project
 */
export const updateProject = async (id: number, projectObj: Partial<CreateProjectsRequest>): Promise<ApiResponse<ListProjectResponse>> => {
    const response = await apiClient.patch<ApiResponse<ListProjectResponse>>(`/projects/${id}`, projectObj);
    return response.data;
};

/**
 * Get updates for a project
 */
export const getProjectUpdates = async (projectId: number): Promise<ApiResponse<ProjectUpdate[]>> => {
    const response = await apiClient.get<ApiResponse<ProjectUpdate[]>>(`/projects/${projectId}/updates`);
    return response.data;
};

/**
 * Add an update to a project
 */
export const addProjectUpdate = async (projectId: number, title: string, content: string): Promise<ApiResponse<ProjectUpdate>> => {
    const response = await apiClient.post<ApiResponse<ProjectUpdate>>(`/projects/${projectId}/updates`, { title, content });
    return response.data;
};

/**
 * Delete a project update
 */
export const deleteProjectUpdate = async (projectId: number, updateId: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/projects/${projectId}/updates/${updateId}`);
    console.log(response.data);
    return response.data;
};

/**
 * Get files and links for a project
 */
export const getProjectFiles = async (projectId: number): Promise<ApiResponse<ProjectFileLink[]>> => {
    const response = await apiClient.get<ApiResponse<ProjectFileLink[]>>(`/projects/${projectId}/files`);
    return response.data;
};

/**
 * Add a file or link to a project
 */
export const addProjectFileLink = async (projectId: number, fileLinkObj: { title: string; url: string; type: 'file' | 'link' }): Promise<ApiResponse<ProjectFileLink>> => {
    const response = await apiClient.post<ApiResponse<ProjectFileLink>>(`/projects/${projectId}/files`, fileLinkObj);
    return response.data;
};

/**
 * Upload a file to a project
 */
export const uploadProjectFile = async (projectId: number, file: File, title?: string): Promise<ApiResponse<ProjectFileLink>> => {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    const response = await apiClient.post<ApiResponse<ProjectFileLink>>(
        `/projects/${projectId}/files/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
};

/**
 * Delete a file or link from a project
 */
export const deleteProjectFileLink = async (projectId: number, fileLinkId: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/projects/${projectId}/files/${fileLinkId}`);
    return response.data;
};



