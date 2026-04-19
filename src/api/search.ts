import apiClient from './client';
import type { SearchCriteria } from '../components/SearchFilter';
import type { TagResponse } from './tagApi';

/**
 * Search API Service
 * Handles all search and filter operations with the backend
 */

export interface NoteResponse {
  id: string;
  title: string;
  content: string;
  tags: TagResponse[];
  isFavorite: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
  isEmpty: boolean;
}

class SearchService {
  /**
   * Advanced search with multiple filter criteria
   * Uses POST method for cleaner request handling
   */
  async searchNotes(
    criteria: SearchCriteria = {},
    page: number = 0,
    size: number = 10
  ): Promise<SearchResponse<NoteResponse>> {
    try {
      // Build request body with criteria
      const payload = {
        keyword: criteria.keyword?.trim() || undefined,
        tags: criteria.tags && criteria.tags.length > 0 ? criteria.tags : undefined,
        startDate: criteria.startDate ? this.formatDateForApi(criteria.startDate, true) : undefined,
        endDate: criteria.endDate ? this.formatDateForApi(criteria.endDate, false) : undefined,
        isFavorite: criteria.isFavorite !== undefined ? criteria.isFavorite : undefined,
        sortBy: criteria.sortBy || 'updatedAt',
        sortDirection: criteria.sortDirection || 'desc',
      };

      // Remove undefined fields to keep payload clean
      Object.keys(payload).forEach(
        (key) => payload[key as keyof typeof payload] === undefined && delete payload[key as keyof typeof payload]
      );

      const response = await apiClient.post<SearchResponse<NoteResponse>>(
        `/notes/search-advanced?page=${page}&size=${size}`,
        payload
      );

      return response.data;
    } catch (error: any) {
      console.error('Search failed:', error);
      throw error;
    }
  }

  /**
   * Legacy search endpoint for backward compatibility
   */
  async legacySearch(
    query: string = '',
    tags: string[] = [],
    startDate: string = '',
    endDate: string = '',
    page: number = 0,
    size: number = 10,
    sortBy: string = 'updatedAt',
    sortDir: string = 'desc'
  ): Promise<SearchResponse<NoteResponse>> {
    try {
      const params = new URLSearchParams();

      if (query.trim()) params.append('query', query.trim());
      if (tags.length > 0) tags.forEach((tag) => params.append('tags', tag));
      if (startDate) params.append('startDate', this.formatDateForApi(startDate, true));
      if (endDate) params.append('endDate', this.formatDateForApi(endDate, false));

      params.append('page', page.toString());
      params.append('size', size.toString());
      params.append('sortBy', sortBy);
      params.append('sortDir', sortDir);

      const response = await apiClient.get<SearchResponse<NoteResponse>>(
        `/notes/search?${params.toString()}`
      );

      return response.data;
    } catch (error: any) {
      console.error('Legacy search failed:', error);
      throw error;
    }
  }

  /**
   * Get all notes with pagination
   */
  async getAllNotes(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'updatedAt',
    sortDir: string = 'desc'
  ): Promise<SearchResponse<NoteResponse>> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('size', size.toString());
      params.append('sortBy', sortBy);
      params.append('sortDir', sortDir);

      const response = await apiClient.get<SearchResponse<NoteResponse>>(
        `/notes?${params.toString()}`
      );

      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch notes:', error);
      throw error;
    }
  }

  /**
   * Get trash notes
   */
  async getTrashNotes(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'updatedAt',
    sortDir: string = 'desc'
  ): Promise<SearchResponse<NoteResponse>> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('size', size.toString());
      params.append('sortBy', sortBy);
      params.append('sortDir', sortDir);

      const response = await apiClient.get<SearchResponse<NoteResponse>>(
        `/notes/trash?${params.toString()}`
      );

      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch trash notes:', error);
      throw error;
    }
  }

  /**
   * Helper: Format date for API (ISO 8601 format)
   * If isStartDate is true, set time to 00:00:00
   * If isStartDate is false (end date), set time to 23:59:59
   */
  private formatDateForApi(dateString: string, isStartDate: boolean): string {
    const date = new Date(dateString);
    
    if (isStartDate) {
      // Start of day
      date.setHours(0, 0, 0, 0);
    } else {
      // End of day
      date.setHours(23, 59, 59, 999);
    }
    
    return date.toISOString();
  }
}

export const searchService = new SearchService();
