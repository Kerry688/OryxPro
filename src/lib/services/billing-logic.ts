// Billing logic for warranty vs non-warranty service requests

import { WorkOrder, LaborEntry, PartsEntry, ServiceEntry, BillingAssessment } from '@/lib/models/service-request';
import { WarrantyCheckResult } from '@/lib/services/warranty-checker';

export interface BillingCalculation {
  totalCost: number;
  warrantyCoveredCost: number;
  billableCost: number;
  breakdown: {
    labor: {
      total: number;
      warrantyCovered: number;
      billable: number;
    };
    parts: {
      total: number;
      warrantyCovered: number;
      billable: number;
    };
    services: {
      total: number;
      warrantyCovered: number;
      billable: number;
    };
  };
}

export interface SalesOrderData {
  customerId: string;
  customerName: string;
  items: Array<{
    type: 'labor' | 'parts' | 'service';
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    category?: string;
  }>;
  notes?: string;
  createdBy: string;
}

export class BillingLogic {
  /**
   * Calculate billing for a work order based on warranty coverage
   */
  static calculateBilling(workOrder: WorkOrder, warrantyResult: WarrantyCheckResult): BillingCalculation {
    const laborCosts = this.calculateLaborCosts(workOrder.laborEntries, warrantyResult.coverageDetails.labor);
    const partsCosts = this.calculatePartsCosts(workOrder.partsUsed, warrantyResult.coverageDetails.parts);
    const serviceCosts = this.calculateServiceCosts(workOrder.services, warrantyResult.coverageDetails.labor);

    const totalCost = laborCosts.total + partsCosts.total + serviceCosts.total;
    const warrantyCoveredCost = laborCosts.warrantyCovered + partsCosts.warrantyCovered + serviceCosts.warrantyCovered;
    const billableCost = laborCosts.billable + partsCosts.billable + serviceCosts.billable;

    return {
      totalCost,
      warrantyCoveredCost,
      billableCost,
      breakdown: {
        labor: laborCosts,
        parts: partsCosts,
        services: serviceCosts,
      },
    };
  }

  /**
   * Calculate labor costs
   */
  private static calculateLaborCosts(laborEntries: LaborEntry[], isWarrantyCovered: boolean): {
    total: number;
    warrantyCovered: number;
    billable: number;
  } {
    let total = 0;
    let warrantyCovered = 0;
    let billable = 0;

    for (const entry of laborEntries) {
      total += entry.totalCost;
      
      if (isWarrantyCovered && entry.isWarrantyCovered) {
        warrantyCovered += entry.totalCost;
      } else {
        billable += entry.totalCost;
      }
    }

    return { total, warrantyCovered, billable };
  }

  /**
   * Calculate parts costs
   */
  private static calculatePartsCosts(partsUsed: PartsEntry[], isWarrantyCovered: boolean): {
    total: number;
    warrantyCovered: number;
    billable: number;
  } {
    let total = 0;
    let warrantyCovered = 0;
    let billable = 0;

    for (const part of partsUsed) {
      total += part.totalCost;
      
      if (isWarrantyCovered && part.isWarrantyCovered) {
        warrantyCovered += part.totalCost;
      } else {
        billable += part.totalCost;
      }
    }

    return { total, warrantyCovered, billable };
  }

  /**
   * Calculate service costs
   */
  private static calculateServiceCosts(services: ServiceEntry[], isWarrantyCovered: boolean): {
    total: number;
    warrantyCovered: number;
    billable: number;
  } {
    let total = 0;
    let warrantyCovered = 0;
    let billable = 0;

    for (const service of services) {
      total += service.cost;
      
      if (isWarrantyCovered && service.isWarrantyCovered) {
        warrantyCovered += service.cost;
      } else {
        billable += service.cost;
      }
    }

    return { total, warrantyCovered, billable };
  }

  /**
   * Determine billing status based on warranty coverage
   */
  static determineBillingStatus(warrantyResult: WarrantyCheckResult, calculation: BillingCalculation): 'warranty_covered' | 'billable' | 'mixed' {
    if (warrantyResult.isWarrantyCovered && calculation.billableCost === 0) {
      return 'warranty_covered';
    } else if (!warrantyResult.isWarrantyCovered && calculation.warrantyCoveredCost === 0) {
      return 'billable';
    } else {
      return 'mixed';
    }
  }

  /**
   * Generate sales order data for billable items
   */
  static generateSalesOrderData(workOrder: WorkOrder, calculation: BillingCalculation): SalesOrderData {
    const items: SalesOrderData['items'] = [];

    // Add billable labor
    for (const labor of workOrder.laborEntries) {
      if (!labor.isWarrantyCovered) {
        items.push({
          type: 'labor',
          description: labor.description,
          quantity: labor.duration,
          unitPrice: labor.hourlyRate,
          totalPrice: labor.totalCost,
          category: labor.category,
        });
      }
    }

    // Add billable parts
    for (const part of workOrder.partsUsed) {
      if (!part.isWarrantyCovered) {
        items.push({
          type: 'parts',
          description: `${part.partName} (${part.partNumber})`,
          quantity: part.quantity,
          unitPrice: part.unitCost,
          totalPrice: part.totalCost,
          category: part.category,
        });
      }
    }

    // Add billable services
    for (const service of workOrder.services) {
      if (!service.isWarrantyCovered) {
        items.push({
          type: 'service',
          description: service.serviceName,
          quantity: 1,
          unitPrice: service.cost,
          totalPrice: service.cost,
          category: service.category,
        });
      }
    }

    return {
      customerId: workOrder.customerId,
      customerName: workOrder.customerName,
      items,
      notes: `Service request for ${workOrder.productName} (Work Order: ${workOrder.workOrderNumber})`,
      createdBy: workOrder.createdBy,
    };
  }

  /**
   * Create sales order for billable items
   */
  static async createSalesOrder(salesOrderData: SalesOrderData): Promise<{ success: boolean; salesOrderId?: string; error?: string }> {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: salesOrderData.customerId,
          customerName: salesOrderData.customerName,
          items: salesOrderData.items.map(item => ({
            productId: item.type === 'parts' ? item.description : null,
            productName: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            category: item.category,
          })),
          orderType: 'service',
          status: 'pending',
          notes: salesOrderData.notes,
          createdBy: salesOrderData.createdBy,
        }),
      });

      const data = await response.json();
      return {
        success: data.success,
        salesOrderId: data.data?._id,
        error: data.error,
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
   * Create billing assessment record
   */
  static async createBillingAssessment(
    serviceRequestId: string,
    workOrderId: string,
    calculation: BillingCalculation,
    billingStatus: string,
    salesOrderId?: string,
    assessedBy: string = 'system'
  ): Promise<BillingAssessment> {
    const billingAssessment: BillingAssessment = {
      serviceRequestId,
      workOrderId,
      assessmentDate: new Date(),
      assessedBy,
      billingStatus: billingStatus as any,
      warrantyCoveredItems: {
        labor: calculation.breakdown.labor.warrantyCovered,
        parts: calculation.breakdown.parts.warrantyCovered,
        services: calculation.breakdown.services.warrantyCovered,
        total: calculation.warrantyCoveredCost,
      },
      billableItems: {
        labor: calculation.breakdown.labor.billable,
        parts: calculation.breakdown.parts.billable,
        services: calculation.breakdown.services.billable,
        total: calculation.billableCost,
      },
      salesOrderId,
      paymentStatus: billingStatus === 'billable' ? 'pending' : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to database
    const response = await fetch('/api/service-requests/billing-assessments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(billingAssessment),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error('Failed to create billing assessment');
    }

    return data.data;
  }

  /**
   * Process warranty claim for third-party warranty
   */
  static async processWarrantyClaim(
    workOrder: WorkOrder,
    warrantyResult: WarrantyCheckResult,
    calculation: BillingCalculation
  ): Promise<{ success: boolean; claimId?: string; error?: string }> {
    try {
      // Create warranty claim
      const claimData = {
        warrantyCardId: workOrder.warrantyCardId!,
        issueDescription: `Service request for ${workOrder.productName}`,
        claimType: 'repair' as const,
        priority: 'medium' as const,
        severity: 'moderate' as const,
        reportedBy: workOrder.createdBy,
        evidence: {
          photos: [],
          documents: [],
          videos: [],
        },
        notes: `Work Order: ${workOrder.workOrderNumber}. Warranty covered cost: $${calculation.warrantyCoveredCost}`,
        createdBy: workOrder.createdBy,
      };

      const response = await fetch('/api/warranties/claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(claimData),
      });

      const data = await response.json();
      return {
        success: data.success,
        claimId: data.data?._id,
        error: data.error,
      };
    } catch (error) {
      console.error('Error processing warranty claim:', error);
      return {
        success: false,
        error: 'Failed to process warranty claim',
      };
    }
  }
}
