// Client-side safe API client for warranty operations
// This file never imports MongoDB and is safe for client-side use

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

export interface WarrantyCard {
  _id?: string;
  warrantyNumber: string;
  productId: string;
  productName: string;
  productSku: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderId?: string;
  orderNumber?: string;
  warrantyType: string;
  status: string;
  startDate: string;
  endDate: string;
  duration: number;
  terms: string;
  coverage: any;
  serialNumber?: string;
  batchNumber?: string;
  purchaseDate: string;
  purchasePrice: number;
  vendor?: string;
  provider: any;
  claims: any[];
  totalClaims: number;
  lastClaimDate?: string;
  notes?: string;
  attachments: string[];
  isTransferable: boolean;
  transferFee?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface WarrantyClaim {
  _id?: string;
  claimNumber: string;
  warrantyCardId: string;
  customerId: string;
  status: string;
  issueDescription: string;
  reportedDate: string;
  expectedResolutionDate?: string;
  actualResolutionDate?: string;
  claimType: string;
  priority: string;
  severity: string;
  resolution?: any;
  serviceProvider?: any;
  evidence: any;
  communications: any[];
  trackingNumber?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export class WarrantyApiClient {
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
  }): Promise<ApiResponse<WarrantyCard[]>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    return this.request<WarrantyCard[]>(`/api/warranties?${searchParams.toString()}`);
  }

  async getWarranty(id: string): Promise<ApiResponse<WarrantyCard>> {
    return this.request<WarrantyCard>(`/api/warranties/${id}`);
  }

  async createWarranty(data: any): Promise<ApiResponse<WarrantyCard>> {
    return this.request<WarrantyCard>('/api/warranties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateWarranty(id: string, data: any): Promise<ApiResponse<WarrantyCard>> {
    return this.request<WarrantyCard>(`/api/warranties/${id}`, {
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
  }): Promise<ApiResponse<WarrantyClaim[]>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    return this.request<WarrantyClaim[]>(`/api/warranties/claims?${searchParams.toString()}`);
  }

  async getClaim(id: string): Promise<ApiResponse<WarrantyClaim>> {
    return this.request<WarrantyClaim>(`/api/warranties/claims/${id}`);
  }

  async createClaim(data: any): Promise<ApiResponse<WarrantyClaim>> {
    return this.request<WarrantyClaim>('/api/warranties/claims', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateClaim(id: string, data: any): Promise<ApiResponse<WarrantyClaim>> {
    return this.request<WarrantyClaim>(`/api/warranties/claims/${id}`, {
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
export const warrantyApiClient = new WarrantyApiClient();
