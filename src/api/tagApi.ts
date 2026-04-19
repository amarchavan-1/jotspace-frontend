import apiClient from './client';

export interface TagResponse {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface TagRequest {
  name: string;
  color: string;
}

class TagService {
  async getAllTags(): Promise<TagResponse[]> {
    try {
      const response = await apiClient.get<TagResponse[]>('/tags');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      throw error;
    }
  }

  async createTag(data: TagRequest): Promise<TagResponse> {
    try {
      const response = await apiClient.post<TagResponse>('/tags', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create tag:', error);
      throw error;
    }
  }

  async updateTag(id: string, data: TagRequest): Promise<TagResponse> {
    try {
      const response = await apiClient.put<TagResponse>(`/tags/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update tag:', error);
      throw error;
    }
  }

  async deleteTag(id: string): Promise<void> {
    try {
      await apiClient.delete(`/tags/${id}`);
    } catch (error) {
      console.error('Failed to delete tag:', error);
      throw error;
    }
  }
}

export const tagApi = new TagService();
