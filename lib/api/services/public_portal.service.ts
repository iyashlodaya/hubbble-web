import { apiClient } from '../client';
import type { ApiResponse } from '../types';
import type { ListProjectResponse, ProjectUpdate, ProjectFileLink, FreelancerBranding } from './projects.service';

export interface PublicPortalData extends ListProjectResponse {
    updates: ProjectUpdate[];
    files: ProjectFileLink[];
    freelancer: FreelancerBranding;
}

/**
 * Get public portal data by slug
 */
export const getPublicPortal = async (slug: string): Promise<ApiResponse<PublicPortalData>> => {
    const response = await apiClient.get<ApiResponse<PublicPortalData>>(`/public/${slug}`);
    return response.data;
};
