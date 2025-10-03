// Main service request processing workflow

import { ServiceRequest, WorkOrder, CreateServiceRequestData, CreateWorkOrderData } from '@/lib/models/service-request';
import { WarrantyChecker, WarrantyCheckResult } from '@/lib/services/warranty-checker';
import { BillingLogic, BillingCalculation } from '@/lib/services/billing-logic';

export interface ServiceWorkflowResult {
  success: boolean;
  serviceRequestId?: string;
  workOrderId?: string;
  warrantyResult?: WarrantyCheckResult;
  billingCalculation?: BillingCalculation;
  salesOrderId?: string;
  warrantyClaimId?: string;
  error?: string;
}

export class ServiceWorkflow {
  /**
   * Process a complete service request workflow
   */
  static async processServiceRequest(
    serviceRequestData: CreateServiceRequestData,
    workOrderData: CreateWorkOrderData,
    processedBy: string
  ): Promise<ServiceWorkflowResult> {
    try {
      // Step 1: Create service request
      const serviceRequest = await this.createServiceRequest(serviceRequestData);
      if (!serviceRequest.success || !serviceRequest.serviceRequestId) {
        return { success: false, error: 'Failed to create service request' };
      }

      // Step 2: Create work order
      const workOrder = await this.createWorkOrder(serviceRequest.serviceRequestId, workOrderData);
      if (!workOrder.success || !workOrder.workOrderId) {
        return { success: false, error: 'Failed to create work order' };
      }

      // Step 3: Check warranty status
      const warrantyResult = await this.checkWarrantyStatus(serviceRequestData);
      if (!warrantyResult.success) {
        return { success: false, error: 'Failed to check warranty status' };
      }

      // Step 4: Calculate billing
      const billingCalculation = await this.calculateBilling(workOrder.workOrderId!, warrantyResult.warrantyResult!);
      if (!billingCalculation.success) {
        return { success: false, error: 'Failed to calculate billing' };
      }

      // Step 5: Process billing based on warranty coverage
      let salesOrderId: string | undefined;
      let warrantyClaimId: string | undefined;

      if (billingCalculation.billingStatus === 'billable' || billingCalculation.billingStatus === 'mixed') {
        // Create sales order for billable items
        const salesOrder = await this.createSalesOrder(workOrder.workOrderId!, billingCalculation.billingCalculation!);
        if (salesOrder.success) {
          salesOrderId = salesOrder.salesOrderId;
        }
      }

      if (warrantyResult.warrantyResult?.isWarrantyCovered) {
        // Process warranty claim if needed
        const warrantyClaim = await this.processWarrantyClaim(workOrder.workOrderId!, warrantyResult.warrantyResult);
        if (warrantyClaim.success) {
          warrantyClaimId = warrantyClaim.claimId;
        }
      }

      return {
        success: true,
        serviceRequestId: serviceRequest.serviceRequestId,
        workOrderId: workOrder.workOrderId,
        warrantyResult: warrantyResult.warrantyResult,
        billingCalculation: billingCalculation.billingCalculation,
        salesOrderId,
        warrantyClaimId,
      };
    } catch (error) {
      console.error('Error processing service request workflow:', error);
      return {
        success: false,
        error: 'Failed to process service request workflow',
      };
    }
  }

  /**
   * Create service request
   */
  private static async createServiceRequest(data: CreateServiceRequestData): Promise<{
    success: boolean;
    serviceRequestId?: string;
    error?: string;
  }> {
    try {
      const response = await fetch('/api/service-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return {
        success: result.success,
        serviceRequestId: result.data?._id,
        error: result.error,
      };
    } catch (error) {
      console.error('Error creating service request:', error);
      return {
        success: false,
        error: 'Failed to create service request',
      };
    }
  }

  /**
   * Create work order
   */
  private static async createWorkOrder(serviceRequestId: string, data: CreateWorkOrderData): Promise<{
    success: boolean;
    workOrderId?: string;
    error?: string;
  }> {
    try {
      const response = await fetch('/api/service-requests/work-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          serviceRequestId,
        }),
      });

      const result = await response.json();
      return {
        success: result.success,
        workOrderId: result.data?._id,
        error: result.error,
      };
    } catch (error) {
      console.error('Error creating work order:', error);
      return {
        success: false,
        error: 'Failed to create work order',
      };
    }
  }

  /**
   * Check warranty status
   */
  private static async checkWarrantyStatus(serviceRequestData: CreateServiceRequestData): Promise<{
    success: boolean;
    warrantyResult?: WarrantyCheckResult;
    error?: string;
  }> {
    try {
      const warrantyResult = await WarrantyChecker.checkWarrantyStatus({
        productId: serviceRequestData.productId,
        serialNumber: serviceRequestData.serialNumber,
        customerId: serviceRequestData.customerId,
        serviceDate: new Date(),
        issueType: serviceRequestData.issueDescription,
      });

      return {
        success: true,
        warrantyResult,
      };
    } catch (error) {
      console.error('Error checking warranty status:', error);
      return {
        success: false,
        error: 'Failed to check warranty status',
      };
    }
  }

  /**
   * Calculate billing
   */
  private static async calculateBilling(workOrderId: string, warrantyResult: WarrantyCheckResult): Promise<{
    success: boolean;
    billingCalculation?: BillingCalculation;
    billingStatus?: string;
    error?: string;
  }> {
    try {
      // Get work order details
      const workOrderResponse = await fetch(`/api/service-requests/work-orders/${workOrderId}`);
      const workOrderData = await workOrderResponse.json();
      
      if (!workOrderData.success) {
        return {
          success: false,
          error: 'Failed to fetch work order',
        };
      }

      const workOrder = workOrderData.data;
      const billingCalculation = BillingLogic.calculateBilling(workOrder, warrantyResult);
      const billingStatus = BillingLogic.determineBillingStatus(warrantyResult, billingCalculation);

      return {
        success: true,
        billingCalculation,
        billingStatus,
      };
    } catch (error) {
      console.error('Error calculating billing:', error);
      return {
        success: false,
        error: 'Failed to calculate billing',
      };
    }
  }

  /**
   * Create sales order
   */
  private static async createSalesOrder(workOrderId: string, billingCalculation: BillingCalculation): Promise<{
    success: boolean;
    salesOrderId?: string;
    error?: string;
  }> {
    try {
      // Get work order details
      const workOrderResponse = await fetch(`/api/service-requests/work-orders/${workOrderId}`);
      const workOrderData = await workOrderResponse.json();
      
      if (!workOrderData.success) {
        return {
          success: false,
          error: 'Failed to fetch work order',
        };
      }

      const workOrder = workOrderData.data;
      const salesOrderData = BillingLogic.generateSalesOrderData(workOrder, billingCalculation);
      const salesOrder = await BillingLogic.createSalesOrder(salesOrderData);

      return {
        success: salesOrder.success,
        salesOrderId: salesOrder.salesOrderId,
        error: salesOrder.error,
      };
    } catch (error) {
      console.error('Error creating sales order:', error);
      return {
        success: false,
        error: 'Failed to create sales order',
      };
    }
  }

  /**
   * Process warranty claim
   */
  private static async processWarrantyClaim(workOrderId: string, warrantyResult: WarrantyCheckResult): Promise<{
    success: boolean;
    claimId?: string;
    error?: string;
  }> {
    try {
      // Get work order details
      const workOrderResponse = await fetch(`/api/service-requests/work-orders/${workOrderId}`);
      const workOrderData = await workOrderResponse.json();
      
      if (!workOrderData.success) {
        return {
          success: false,
          error: 'Failed to fetch work order',
        };
      }

      const workOrder = workOrderData.data;
      const warrantyClaim = await BillingLogic.processWarrantyClaim(workOrder, warrantyResult, {
        totalCost: workOrder.totalCost,
        warrantyCoveredCost: workOrder.warrantyCoveredCost,
        billableCost: workOrder.billableCost,
        breakdown: {
          labor: { total: 0, warrantyCovered: 0, billable: 0 },
          parts: { total: 0, warrantyCovered: 0, billable: 0 },
          services: { total: 0, warrantyCovered: 0, billable: 0 },
        },
      });

      return {
        success: warrantyClaim.success,
        claimId: warrantyClaim.claimId,
        error: warrantyClaim.error,
      };
    } catch (error) {
      console.error('Error processing warranty claim:', error);
      return {
        success: false,
        error: 'Failed to process warranty claim',
      };
    }
  }

  /**
   * Update work order with labor, parts, and services
   */
  static async updateWorkOrder(
    workOrderId: string,
    updates: {
      laborEntries?: any[];
      partsUsed?: any[];
      services?: any[];
      status?: string;
      completionDate?: Date;
      notes?: string;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`/api/service-requests/work-orders/${workOrderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const result = await response.json();
      return {
        success: result.success,
        error: result.error,
      };
    } catch (error) {
      console.error('Error updating work order:', error);
      return {
        success: false,
        error: 'Failed to update work order',
      };
    }
  }

  /**
   * Complete work order and finalize billing
   */
  static async completeWorkOrder(workOrderId: string): Promise<{
    success: boolean;
    salesOrderId?: string;
    invoiceId?: string;
    error?: string;
  }> {
    try {
      // Update work order status
      await this.updateWorkOrder(workOrderId, {
        status: 'completed',
        completionDate: new Date(),
      });

      // Get work order details
      const workOrderResponse = await fetch(`/api/service-requests/work-orders/${workOrderId}`);
      const workOrderData = await workOrderResponse.json();
      
      if (!workOrderData.success) {
        return {
          success: false,
          error: 'Failed to fetch work order',
        };
      }

      const workOrder = workOrderData.data;

      // If there are billable items, create sales order
      if (workOrder.billableCost > 0) {
        const salesOrder = await this.createSalesOrder(workOrderId, {
          totalCost: workOrder.totalCost,
          warrantyCoveredCost: workOrder.warrantyCoveredCost,
          billableCost: workOrder.billableCost,
          breakdown: {
            labor: { total: 0, warrantyCovered: 0, billable: 0 },
            parts: { total: 0, warrantyCovered: 0, billable: 0 },
            services: { total: 0, warrantyCovered: 0, billable: 0 },
          },
        });

        if (salesOrder.success) {
          return {
            success: true,
            salesOrderId: salesOrder.salesOrderId,
          };
        }
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error('Error completing work order:', error);
      return {
        success: false,
        error: 'Failed to complete work order',
      };
    }
  }
}
