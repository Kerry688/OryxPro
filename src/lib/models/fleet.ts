export interface Vehicle {
  _id?: string;
  id?: string; // For compatibility with components
  vehicleId?: string; // Unique vehicle identifier (legacy)
  assetId?: string; // Link to main asset record
  
  // Basic Information
  make: string;
  model: string;
  year: number;
  vin?: string; // Vehicle Identification Number
  licensePlate: string;
  color?: string;
  
  // Vehicle Details
  vehicleType: VehicleType;
  category: VehicleCategory;
  fuelType: FuelType;
  transmission: TransmissionType;
  engineSize?: string;
  seatingCapacity?: number;
  cargoCapacity?: number; // in kg or cubic meters
  
  // Ownership & Registration
  ownershipType: OwnershipType;
  registrationNumber: string;
  registrationExpiry: Date;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceExpiry?: Date;
  
  // Key Documents
  documents: VehicleDocument[];
  
  // Current Status
  status: VehicleStatus;
  currentLocation?: string;
  currentDriver?: string; // Driver ID
  isAvailable: boolean;
  
  // Financial
  purchasePrice?: number;
  currentValue?: number;
  leaseRate?: number; // monthly if leased
  leaseEndDate?: Date;
  
  // Maintenance
  lastServiceDate?: Date;
  nextServiceDate?: Date;
  lastInspectionDate?: Date;
  nextInspectionDate?: Date;
  
  // Usage Tracking
  totalMileage: number;
  currentMileage: number;
  lastOdometerReading: number;
  lastOdometerReadingDate: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface Driver {
  _id?: string;
  id?: string; // For compatibility with components
  driverId: string; // Unique driver identifier
  employeeId?: string; // Link to employee record
  
  // Personal Information
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  
  // License Information
  licenseNumber: string;
  licenseType: string; // License type as string for simplicity
  licenseExpiry: Date;
  licenseIssuingAuthority?: string;
  licenseClass?: string;
  
  // Employment Details
  department?: string;
  position?: string;
  hireDate?: Date;
  isActive?: boolean;
  status: DriverStatus;
  
  // Emergency Contact
  emergencyContact?: string;
  
  // Current Assignment
  assignedVehicleId?: string; // Vehicle ID
  assignedVehicleName?: string; // Vehicle name for display
  currentVehicle?: string; // Vehicle ID (legacy)
  assignedVehicles?: string[]; // Array of vehicle IDs (legacy)
  
  // Notes
  notes?: string;
  
  // Driving History
  totalMilesDriven?: number;
  totalTrips?: number;
  accidents?: number;
  violations?: number;
  
  // Documents
  documents?: DriverDocument[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface Trip {
  _id?: string;
  id?: string; // For compatibility with components
  tripId?: string; // Unique trip identifier (legacy)
  vehicleId: string;
  vehicleName?: string; // Vehicle name for display
  driverId: string;
  driverName?: string; // Driver name for display
  
  // Trip Details
  startLocation: string;
  endLocation?: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  purpose?: string; // Trip purpose
  
  // Distance & Mileage
  startOdometer?: number; // Legacy
  endOdometer?: number; // Legacy
  mileageStart?: number; // Start mileage
  mileageEnd?: number; // End mileage
  distance: number; // in km or miles
  
  // Fuel Information
  fuelConsumed?: number; // Fuel consumed for this trip
  
  // Trip Classification
  tripType: TripType;
  businessPurpose?: string;
  customerName?: string;
  projectCode?: string;
  
  // Cost Tracking
  fuelCost?: number;
  tolls?: number;
  parking?: number;
  otherCosts?: number;
  totalCost?: number;
  
  // Status
  status: TripStatus;
  notes?: string;
  
  // Approval
  requiresApproval?: boolean;
  approvedBy?: string;
  approvalDate?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface FuelRecord {
  _id?: string;
  fuelRecordId: string; // Unique fuel record identifier
  vehicleId: string;
  driverId?: string;
  
  // Fuel Details
  fuelDate: Date;
  fuelType: FuelType;
  quantity: number; // in liters or gallons
  unitPrice: number;
  totalCost: number;
  
  // Location
  fuelStation: string;
  location?: string;
  
  // Odometer
  odometerReading: number;
  mileageSinceLastFill?: number;
  fuelEfficiency?: number; // km/liter or miles/gallon
  
  // Receipt
  receiptNumber?: string;
  receiptImage?: string;
  
  // Status
  status: FuelRecordStatus;
  notes?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface VehicleMaintenance {
  _id?: string;
  id?: string; // For compatibility with components
  maintenanceId?: string; // Unique maintenance identifier (legacy)
  vehicleId: string;
  vehicleName?: string; // Vehicle name for display
  
  // Maintenance Details
  maintenanceType: MaintenanceType;
  title?: string; // Legacy
  description: string;
  
  // Scheduling
  scheduledDate: Date;
  completedDate?: Date;
  dueDate?: Date;
  priority?: MaintenancePriority;
  
  // Service Provider
  serviceProvider?: string;
  serviceProviderContact?: string; // Service provider contact
  serviceLocation?: string;
  technicianName?: string;
  technician?: string; // Technician name (alias)
  
  // Costs
  laborCost?: number;
  partsCost?: number;
  totalCost?: number;
  cost?: number; // Total cost (alias)
  
  // Mileage
  odometerReading?: number; // Legacy
  mileageAtService?: number; // Mileage at service
  nextServiceMileage?: number;
  
  // Parts Used
  partsUsed?: MaintenancePart[];
  
  // Status
  status: MaintenanceStatus;
  
  // Notes
  notes?: string;
  
  // Documents
  workOrderNumber?: string;
  invoiceNumber?: string;
  warrantyExpiry?: Date;
  
  // Follow-up
  nextServiceDue?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface Tire {
  _id?: string;
  id?: string; // For compatibility with components
  tireId?: string; // Unique tire identifier (legacy)
  serialNumber: string;
  vehicleId: string;
  vehicleName?: string; // Vehicle name for display
  position: TirePosition; // Front Left, Front Right, Rear Left, Rear Right, Spare
  
  // Tire Details
  brand: string;
  model: string;
  size: string; // e.g., "225/60R16"
  
  // Specifications
  loadIndex?: number;
  speedRating?: string;
  treadDepth: number; // in mm
  recommendedTreadDepth?: number;
  
  // Pressure
  pressure?: number; // Current pressure
  recommendedPressure?: number; // Recommended pressure
  
  // Installation
  installationDate: Date;
  installationMileage?: number; // Legacy
  mileageAtInstallation?: number; // Mileage at installation
  installer?: string;
  
  // Usage
  currentMileage: number;
  expectedLifeMileage: number;
  
  // Condition
  condition: string; // Condition as string for simplicity
  lastInspectionDate?: Date;
  nextInspectionDate?: Date;
  
  // Cost Information
  cost?: number; // Tire cost
  supplier?: string; // Tire supplier
  
  // Status
  status: TireStatus;
  
  // Notes
  notes?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

// Supporting Interfaces
export interface VehicleDocument {
  _id?: string;
  documentType: VehicleDocumentType;
  documentName: string;
  documentUrl: string;
  issueDate?: Date;
  expiryDate?: Date;
  isActive: boolean;
  notes?: string;
}

export interface DriverDocument {
  _id?: string;
  documentType: DriverDocumentType;
  documentName: string;
  documentUrl: string;
  issueDate?: Date;
  expiryDate?: Date;
  isActive: boolean;
  notes?: string;
}

export interface MaintenancePart {
  _id?: string;
  id?: string; // For compatibility with components
  partNumber?: string;
  part: string; // Part name
  quantity: number;
  unitCost?: number;
  cost: number; // Total cost
  totalCost?: number; // Legacy
  supplier?: string;
  warrantyPeriod?: number; // in months
}

// Enums
export enum VehicleType {
  CAR = 'car',
  TRUCK = 'truck',
  VAN = 'van',
  SUV = 'suv',
  MOTORCYCLE = 'motorcycle',
  BUS = 'bus',
  FORKLIFT = 'forklift',
  TRACTOR = 'tractor',
  TRAILER = 'trailer',
  OTHER = 'other'
}

export enum VehicleCategory {
  PASSENGER = 'passenger',
  COMMERCIAL = 'commercial',
  CONSTRUCTION = 'construction',
  AGRICULTURAL = 'agricultural',
  EMERGENCY = 'emergency',
  GOVERNMENT = 'government',
  OTHER = 'other'
}

export enum FuelType {
  GASOLINE = 'gasoline',
  DIESEL = 'diesel',
  ELECTRIC = 'electric',
  HYBRID = 'hybrid',
  LPG = 'lpg',
  CNG = 'cng',
  OTHER = 'other'
}

export enum TransmissionType {
  MANUAL = 'manual',
  AUTOMATIC = 'automatic',
  CVT = 'cvt',
  SEMI_AUTOMATIC = 'semi_automatic'
}

export enum OwnershipType {
  OWNED = 'owned',
  LEASED = 'leased',
  RENTED = 'rented',
  COMPANY = 'company'
}

export enum VehicleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  UNDER_MAINTENANCE = 'under_maintenance',
  OUT_OF_SERVICE = 'out_of_service',
  RETIRED = 'retired',
  SOLD = 'sold'
}

export enum LicenseType {
  CLASS_A = 'class_a',
  CLASS_B = 'class_b',
  CLASS_C = 'class_c',
  CLASS_D = 'class_d',
  MOTORCYCLE = 'motorcycle',
  COMMERCIAL = 'commercial',
  CDL = 'cdl'
}

export enum VehicleDocumentType {
  REGISTRATION = 'registration',
  INSURANCE = 'insurance',
  EMISSION_CERTIFICATE = 'emission_certificate',
  SAFETY_INSPECTION = 'safety_inspection',
  LEASE_AGREEMENT = 'lease_agreement',
  PURCHASE_INVOICE = 'purchase_invoice',
  WARRANTY = 'warranty',
  OTHER = 'other'
}

export enum DriverDocumentType {
  LICENSE = 'license',
  MEDICAL_CERTIFICATE = 'medical_certificate',
  BACKGROUND_CHECK = 'background_check',
  DRIVING_RECORD = 'driving_record',
  TRAINING_CERTIFICATE = 'training_certificate',
  OTHER = 'other'
}

export enum TripType {
  BUSINESS = 'business',
  PERSONAL = 'personal',
  MIXED = 'mixed'
}

export enum TripStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum FuelRecordStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum MaintenanceType {
  PREVENTIVE = 'preventive',
  CORRECTIVE = 'corrective',
  EMERGENCY = 'emergency',
  INSPECTION = 'inspection',
  OIL_CHANGE = 'oil_change',
  TIRE_ROTATION = 'tire_rotation',
  BRAKE_SERVICE = 'brake_service',
  ENGINE_SERVICE = 'engine_service'
}

export enum MaintenancePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum MaintenanceStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ON_HOLD = 'on_hold'
}

export enum TirePosition {
  FRONT_LEFT = 'front_left',
  FRONT_RIGHT = 'front_right',
  REAR_LEFT = 'rear_left',
  REAR_RIGHT = 'rear_right',
  SPARE = 'spare'
}

export enum TireCondition {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  CRITICAL = 'critical'
}

export enum TireStatus {
  ACTIVE = 'active',
  NEEDS_REPLACEMENT = 'needs_replacement',
  INSPECTION_DUE = 'inspection_due',
  DAMAGED = 'damaged',
  RETIRED = 'retired',
  SPARE = 'spare',
  DISPOSED = 'disposed'
}

export enum DriverStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
  SUSPENDED = 'suspended'
}

// Fleet Analytics
export interface FleetAnalytics {
  totalVehicles: number;
  activeVehicles: number;
  vehiclesUnderMaintenance: number;
  totalMileage: number;
  averageFuelEfficiency: number;
  totalFuelCost: number;
  totalMaintenanceCost: number;
  averageCostPerMile: number;
  utilizationRate: number;
  complianceRate: number;
}
