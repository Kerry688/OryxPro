// Client-side API utilities for warranty operations
// This ensures MongoDB operations only happen on the server side

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Warranty API methods
  async getWarranties(params?: {
    query?: string;
    status?: string;
    warrantyType?: string;
    productId?: string;
    customerId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ApiResponse> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    return this.request(`/api/warranties?${searchParams.toString()}`);
  }

  async getWarranty(id: string): Promise<ApiResponse> {
    return this.request(`/api/warranties/${id}`);
  }

  async createWarranty(data: any): Promise<ApiResponse> {
    return this.request('/api/warranties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateWarranty(id: string, data: any): Promise<ApiResponse> {
    return this.request(`/api/warranties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteWarranty(id: string): Promise<ApiResponse> {
    return this.request(`/api/warranties/${id}`, {
      method: 'DELETE',
    });
  }

  // Claims API methods
  async getClaims(params?: {
    query?: string;
    status?: string;
    claimType?: string;
    priority?: string;
    severity?: string;
    warrantyCardId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ApiResponse> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    return this.request(`/api/warranties/claims?${searchParams.toString()}`);
  }

  async getClaim(id: string): Promise<ApiResponse> {
    return this.request(`/api/warranties/claims/${id}`);
  }

  async createClaim(data: any): Promise<ApiResponse> {
    return this.request('/api/warranties/claims', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateClaim(id: string, data: any): Promise<ApiResponse> {
    return this.request(`/api/warranties/claims/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteClaim(id: string): Promise<ApiResponse> {
    return this.request(`/api/warranties/claims/${id}`, {
      method: 'DELETE',
    });
  }

  // Analytics API methods
  async getWarrantyAnalytics(params?: {
    period?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    return this.request(`/api/warranties/analytics?${searchParams.toString()}`);
  }
}

// Export a default instance
export const apiClient = new ApiClient();
