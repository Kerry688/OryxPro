// Warranty checking and validation service

import { WarrantyCard, WarrantyStatus } from '@/lib/models/warranty-client';
import { ServiceRequest, WarrantyAssessment } from '@/lib/models/service-request';

export interface WarrantyCheckResult {
  isWarrantyCovered: boolean;
  warrantyStatus: 'covered' | 'expired' | 'partial' | 'void' | 'unknown';
  coverageDetails: {
    labor: boolean;
    parts: boolean;
    replacement: boolean;
    shipping: boolean;
  };
  warrantyCard?: WarrantyCard;
  exclusions: string[];
  limitations: string[];
  notes?: string;
}

export interface WarrantyValidationOptions {
  productId: string;
  serialNumber?: string;
  purchaseDate?: Date;
  serviceDate?: Date;
  issueType?: string;
  customerId?: string;
}

export class WarrantyChecker {
  /**
   * Check warranty status for a service request
   */
  static async checkWarrantyStatus(options: WarrantyValidationOptions): Promise<WarrantyCheckResult> {
    try {
      // Find warranty card by various criteria
      const warrantyCard = await this.findWarrantyCard(options);
      
      if (!warrantyCard) {
        return {
          isWarrantyCovered: false,
          warrantyStatus: 'unknown',
          coverageDetails: {
            labor: false,
            parts: false,
            replacement: false,
            shipping: false,
          },
          exclusions: ['No warranty found'],
          limitations: [],
        };
      }

      // Check if warranty is still valid
      const isExpired = this.isWarrantyExpired(warrantyCard);
      if (isExpired) {
        return {
          isWarrantyCovered: false,
          warrantyStatus: 'expired',
          coverageDetails: {
            labor: false,
            parts: false,
            replacement: false,
            shipping: false,
          },
          warrantyCard,
          exclusions: ['Warranty has expired'],
          limitations: [],
        };
      }

      // Check warranty status
      if (warrantyCard.status === 'void') {
        return {
          isWarrantyCovered: false,
          warrantyStatus: 'void',
          coverageDetails: {
            labor: false,
            parts: false,
            replacement: false,
            shipping: false,
          },
          warrantyCard,
          exclusions: ['Warranty is void'],
          limitations: [],
        };
      }

      // Check if warranty is under review
      if (warrantyCard.status === 'under_review') {
        return {
          isWarrantyCovered: false,
          warrantyStatus: 'partial',
          coverageDetails: {
            labor: false,
            parts: false,
            replacement: false,
            shipping: false,
          },
          warrantyCard,
          exclusions: ['Warranty is under review'],
          limitations: [],
        };
      }

      // Check coverage based on issue type and warranty terms
      const coverageDetails = this.assessCoverage(warrantyCard, options);
      const exclusions = this.getExclusions(warrantyCard, options);
      const limitations = this.getLimitations(warrantyCard, options);

      const isFullyCovered = coverageDetails.labor && coverageDetails.parts && 
                             coverageDetails.replacement && coverageDetails.shipping;
      const isPartiallyCovered = coverageDetails.labor || coverageDetails.parts || 
                                 coverageDetails.replacement || coverageDetails.shipping;

      return {
        isWarrantyCovered: isFullyCovered,
        warrantyStatus: isFullyCovered ? 'covered' : (isPartiallyCovered ? 'partial' : 'expired'),
        coverageDetails,
        warrantyCard,
        exclusions,
        limitations,
        notes: this.generateWarrantyNotes(warrantyCard, coverageDetails, exclusions),
      };
    } catch (error) {
      console.error('Error checking warranty status:', error);
      return {
        isWarrantyCovered: false,
        warrantyStatus: 'unknown',
        coverageDetails: {
          labor: false,
          parts: false,
          replacement: false,
          shipping: false,
        },
        exclusions: ['Error checking warranty status'],
        limitations: [],
      };
    }
  }

  /**
   * Find warranty card by various criteria
   */
  private static async findWarrantyCard(options: WarrantyValidationOptions): Promise<WarrantyCard | null> {
    try {
      // Try to find by serial number first (most specific)
      if (options.serialNumber) {
        const response = await fetch(`/api/warranties?serialNumber=${options.serialNumber}`);
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          return data.data[0];
        }
      }

      // Try to find by product and customer
      if (options.productId && options.customerId) {
        const response = await fetch(`/api/warranties?productId=${options.productId}&customerId=${options.customerId}`);
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          return data.data[0];
        }
      }

      // Try to find by product only
      if (options.productId) {
        const response = await fetch(`/api/warranties?productId=${options.productId}`);
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          return data.data[0];
        }
      }

      return null;
    } catch (error) {
      console.error('Error finding warranty card:', error);
      return null;
    }
  }

  /**
   * Check if warranty is expired
   */
  private static isWarrantyExpired(warrantyCard: WarrantyCard): boolean {
    const now = new Date();
    const endDate = new Date(warrantyCard.endDate);
    return now > endDate;
  }

  /**
   * Assess coverage based on warranty terms and issue type
   */
  private static assessCoverage(warrantyCard: WarrantyCard, options: WarrantyValidationOptions): {
    labor: boolean;
    parts: boolean;
    replacement: boolean;
    shipping: boolean;
  } {
    const coverage = warrantyCard.coverage;
    const issueType = options.issueType?.toLowerCase() || '';

    // Check if issue is covered by warranty terms
    const isIssueCovered = this.isIssueCoveredByWarranty(warrantyCard, issueType);

    return {
      labor: coverage.labor && isIssueCovered,
      parts: coverage.parts && isIssueCovered,
      replacement: coverage.replacement && isIssueCovered,
      shipping: coverage.shipping && isIssueCovered,
    };
  }

  /**
   * Check if specific issue is covered by warranty terms
   */
  private static isIssueCoveredByWarranty(warrantyCard: WarrantyCard, issueType: string): boolean {
    const terms = warrantyCard.terms;
    
    // Check exclusions
    for (const exclusion of terms.exclusions) {
      if (exclusion.toLowerCase().includes(issueType.toLowerCase())) {
        return false;
      }
    }

    // Check if issue matches covered conditions
    for (const condition of terms.conditions) {
      if (condition.toLowerCase().includes(issueType.toLowerCase())) {
        return true;
      }
    }

    // Default to covered if no specific exclusions
    return true;
  }

  /**
   * Get exclusions for this warranty
   */
  private static getExclusions(warrantyCard: WarrantyCard, options: WarrantyValidationOptions): string[] {
    const exclusions = [...warrantyCard.terms.exclusions];
    
    // Add specific exclusions based on issue type
    const issueType = options.issueType?.toLowerCase() || '';
    if (issueType.includes('wear') || issueType.includes('normal use')) {
      exclusions.push('Normal wear and tear');
    }
    if (issueType.includes('accident') || issueType.includes('damage')) {
      exclusions.push('Accidental damage');
    }
    if (issueType.includes('misuse') || issueType.includes('abuse')) {
      exclusions.push('Misuse or abuse');
    }

    return exclusions;
  }

  /**
   * Get limitations for this warranty
   */
  private static getLimitations(warrantyCard: WarrantyCard, options: WarrantyValidationOptions): string[] {
    const limitations = [...warrantyCard.terms.limitations];
    
    // Add specific limitations based on warranty type
    if (warrantyCard.warrantyType === 'manufacturer') {
      limitations.push('Original manufacturer parts only');
    }
    if (warrantyCard.warrantyType === 'extended') {
      limitations.push('Extended warranty terms apply');
    }

    return limitations;
  }

  /**
   * Generate warranty notes
   */
  private static generateWarrantyNotes(
    warrantyCard: WarrantyCard, 
    coverageDetails: any, 
    exclusions: string[]
  ): string {
    const notes = [];
    
    if (coverageDetails.labor) notes.push('Labor covered');
    if (coverageDetails.parts) notes.push('Parts covered');
    if (coverageDetails.replacement) notes.push('Replacement covered');
    if (coverageDetails.shipping) notes.push('Shipping covered');
    
    if (exclusions.length > 0) {
      notes.push(`Exclusions: ${exclusions.join(', ')}`);
    }

    return notes.join('; ');
  }

  /**
   * Create warranty assessment record
   */
  static async createWarrantyAssessment(
    serviceRequestId: string,
    workOrderId: string,
    warrantyCardId: string,
    assessment: WarrantyCheckResult,
    assessedBy: string
  ): Promise<WarrantyAssessment> {
    const warrantyAssessment: WarrantyAssessment = {
      serviceRequestId,
      workOrderId,
      warrantyCardId,
      assessmentDate: new Date(),
      assessedBy,
      warrantyStatus: assessment.warrantyStatus as any,
      coverageDetails: assessment.coverageDetails,
      exclusions: assessment.exclusions,
      notes: assessment.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to database
    const response = await fetch('/api/service-requests/warranty-assessments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(warrantyAssessment),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error('Failed to create warranty assessment');
    }

    return data.data;
  }
}
