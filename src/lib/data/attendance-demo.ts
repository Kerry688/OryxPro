// Demo data for Attendance & Time Tracking module

export const attendanceDemo = {
  // Mock attendance records
  attendanceRecords: [
    {
      attendanceId: 'ATT001',
      employeeId: 'EMP001',
      employeeName: 'Ahmed Mahmoud',
      employeeDepartment: 'Executive',
      employeePosition: 'CEO',
      
      checkInTime: new Date('2024-12-24T08:45:00'),
      checkOutTime: new Date('2024-12-24T17:30:00'),
      checkInMethod: 'biometric',
      checkOutMethod: 'biometric',
      
      checkInLocation: {
        latitude: 30.0444,
        longitude: 31.2357,
        address: 'Main Office - Cairo',
        deviceId: 'DEV001'
      },
      checkOutLocation: {
        latitude: 30.0444,
        longitude: 31.2357,
        address: 'Main Office - Cairo',
        deviceId: 'DEV001'
      },
      
      workDate: new Date('2024-12-24'),
      scheduledStartTime: new Date('2024-12-24T09:00:00'),
      scheduledEndTime: new Date('2024-12-24T17:00:00'),
      
      totalWorkHours: 8.75,
      scheduledHours: 8,
      overtimeHours: 0.75,
      breakHours: 1,
      lateArrivalMinutes: 0,
      earlyDepartureMinutes: 0,
      
      breaks: [
        {
          breakId: 'BRK001',
          breakType: 'lunch',
          startTime: new Date('2024-12-24T12:00:00'),
          endTime: new Date('2024-12-24T13:00:00'),
          duration: 60,
          isActive: false
        }
      ],
      
      status: 'present',
      isApproved: true,
      approvedBy: 'HR_MGR',
      approvedDate: new Date('2024-12-24T18:00:00'),
      
      shiftId: 'SHIFT001',
      shiftName: 'Regular Day Shift',
      shiftType: 'regular',
      
      notes: 'Productive day with client meetings',
      
      createdAt: new Date('2024-12-24T08:45:00'),
      updatedAt: new Date('2024-12-24T17:30:00'),
      createdBy: 'EMP001',
      updatedBy: 'EMP001'
    },
    {
      attendanceId: 'ATT002',
      employeeId: 'EMP002',
      employeeName: 'Fatma Hassan',
      employeeDepartment: 'Human Resources',
      employeePosition: 'HR Manager',
      
      checkInTime: new Date('2024-12-24T08:30:00'),
      checkOutTime: new Date('2024-12-24T17:15:00'),
      checkInMethod: 'rfid',
      checkOutMethod: 'rfid',
      
      checkInLocation: {
        latitude: 30.0444,
        longitude: 31.2357,
        address: 'Main Office - Cairo',
        deviceId: 'DEV002'
      },
      checkOutLocation: {
        latitude: 30.0444,
        longitude: 31.2357,
        address: 'Main Office - Cairo',
        deviceId: 'DEV002'
      },
      
      workDate: new Date('2024-12-24'),
      scheduledStartTime: new Date('2024-12-24T09:00:00'),
      scheduledEndTime: new Date('2024-12-24T17:00:00'),
      
      totalWorkHours: 8.75,
      scheduledHours: 8,
      overtimeHours: 0.75,
      breakHours: 1,
      lateArrivalMinutes: 0,
      earlyDepartureMinutes: 0,
      
      breaks: [
        {
          breakId: 'BRK002',
          breakType: 'lunch',
          startTime: new Date('2024-12-24T12:00:00'),
          endTime: new Date('2024-12-24T13:00:00'),
          duration: 60,
          isActive: false
        }
      ],
      
      status: 'present',
      isApproved: true,
      approvedBy: 'HR_MGR',
      approvedDate: new Date('2024-12-24T18:00:00'),
      
      shiftId: 'SHIFT001',
      shiftName: 'Regular Day Shift',
      shiftType: 'regular',
      
      notes: 'HR team meeting and employee reviews',
      
      createdAt: new Date('2024-12-24T08:30:00'),
      updatedAt: new Date('2024-12-24T17:15:00'),
      createdBy: 'EMP002',
      updatedBy: 'EMP002'
    },
    {
      attendanceId: 'ATT003',
      employeeId: 'EMP003',
      employeeName: 'Youssef El Abbasi',
      employeeDepartment: 'IT',
      employeePosition: 'IT Specialist',
      
      checkInTime: new Date('2024-12-24T09:15:00'),
      checkOutTime: new Date('2024-12-24T18:00:00'),
      checkInMethod: 'online',
      checkOutMethod: 'online',
      
      checkInLocation: {
        latitude: 30.0444,
        longitude: 31.2357,
        address: 'Home Office',
        deviceId: 'WEB001'
      },
      checkOutLocation: {
        latitude: 30.0444,
        longitude: 31.2357,
        address: 'Home Office',
        deviceId: 'WEB001'
      },
      
      workDate: new Date('2024-12-24'),
      scheduledStartTime: new Date('2024-12-24T09:00:00'),
      scheduledEndTime: new Date('2024-12-24T17:00:00'),
      
      totalWorkHours: 8.75,
      scheduledHours: 8,
      overtimeHours: 0.75,
      breakHours: 1,
      lateArrivalMinutes: 15,
      earlyDepartureMinutes: 0,
      
      breaks: [
        {
          breakId: 'BRK003',
          breakType: 'lunch',
          startTime: new Date('2024-12-24T12:00:00'),
          endTime: new Date('2024-12-24T13:00:00'),
          duration: 60,
          isActive: false
        }
      ],
      
      status: 'late',
      isApproved: true,
      approvedBy: 'HR_MGR',
      approvedDate: new Date('2024-12-24T18:00:00'),
      
      shiftId: 'SHIFT001',
      shiftName: 'Regular Day Shift',
      shiftType: 'regular',
      
      notes: 'Working from home - system maintenance',
      
      createdAt: new Date('2024-12-24T09:15:00'),
      updatedAt: new Date('2024-12-24T18:00:00'),
      createdBy: 'EMP003',
      updatedBy: 'EMP003'
    },
    {
      attendanceId: 'ATT004',
      employeeId: 'EMP004',
      employeeName: 'Mariam Hassan',
      employeeDepartment: 'Sales',
      employeePosition: 'Sales Manager',
      
      checkInTime: new Date('2024-12-24T08:45:00'),
      checkOutTime: undefined,
      checkInMethod: 'mobile_app',
      checkOutMethod: 'mobile_app',
      
      checkInLocation: {
        latitude: 30.0444,
        longitude: 31.2357,
        address: 'Client Site - New Cairo',
        deviceId: 'MOB001'
      },
      
      workDate: new Date('2024-12-24'),
      scheduledStartTime: new Date('2024-12-24T09:00:00'),
      scheduledEndTime: new Date('2024-12-24T17:00:00'),
      
      totalWorkHours: 0,
      scheduledHours: 8,
      overtimeHours: 0,
      breakHours: 0,
      lateArrivalMinutes: 0,
      earlyDepartureMinutes: 0,
      
      breaks: [],
      
      status: 'present',
      isApproved: false,
      
      shiftId: 'SHIFT001',
      shiftName: 'Regular Day Shift',
      shiftType: 'regular',
      
      notes: 'Client meetings - still working',
      
      createdAt: new Date('2024-12-24T08:45:00'),
      updatedAt: new Date('2024-12-24T08:45:00'),
      createdBy: 'EMP004',
      updatedBy: 'EMP004'
    },
    {
      attendanceId: 'ATT005',
      employeeId: 'EMP005',
      employeeName: 'Omar Farouk',
      employeeDepartment: 'Marketing',
      employeePosition: 'Marketing Manager',
      
      checkInTime: undefined,
      checkOutTime: undefined,
      checkInMethod: 'manual',
      checkOutMethod: 'manual',
      
      workDate: new Date('2024-12-24'),
      scheduledStartTime: new Date('2024-12-24T09:00:00'),
      scheduledEndTime: new Date('2024-12-24T17:00:00'),
      
      totalWorkHours: 0,
      scheduledHours: 8,
      overtimeHours: 0,
      breakHours: 0,
      lateArrivalMinutes: 0,
      earlyDepartureMinutes: 0,
      
      breaks: [],
      
      status: 'absent',
      isApproved: true,
      approvedBy: 'HR_MGR',
      approvedDate: new Date('2024-12-24T18:00:00'),
      
      shiftId: 'SHIFT001',
      shiftName: 'Regular Day Shift',
      shiftType: 'regular',
      
      notes: 'Sick leave - medical certificate provided',
      
      createdAt: new Date('2024-12-24T09:00:00'),
      updatedAt: new Date('2024-12-24T18:00:00'),
      createdBy: 'HR_MGR',
      updatedBy: 'HR_MGR'
    }
  ],

  // Mock shifts
  shifts: [
    {
      shiftId: 'SHIFT001',
      shiftName: 'Regular Day Shift',
      shiftType: 'regular',
      description: 'Standard 8-hour day shift',
      
      startTime: '09:00',
      endTime: '17:00',
      duration: 8,
      
      breakConfiguration: {
        lunchBreak: {
          duration: 60,
          startTime: '12:00',
          isPaid: false
        },
        shortBreaks: [
          {
            duration: 15,
            startTime: '10:30',
            isPaid: true
          },
          {
            duration: 15,
            startTime: '15:30',
            isPaid: true
          }
        ]
      },
      
      overtimeRules: {
        dailyOvertimeThreshold: 8,
        overtimeRate: 1.5,
        maximumDailyHours: 12,
        weekendRate: 2.0,
        holidayRate: 2.5
      },
      
      applicableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      
      assignedEmployees: [
        {
          employeeId: 'EMP001',
          employeeName: 'Ahmed Mahmoud',
          startDate: new Date('2024-01-01'),
          isActive: true
        },
        {
          employeeId: 'EMP002',
          employeeName: 'Fatma Hassan',
          startDate: new Date('2024-01-01'),
          isActive: true
        },
        {
          employeeId: 'EMP003',
          employeeName: 'Youssef El Abbasi',
          startDate: new Date('2024-01-01'),
          isActive: true
        },
        {
          employeeId: 'EMP004',
          employeeName: 'Mariam Hassan',
          startDate: new Date('2024-01-01'),
          isActive: true
        },
        {
          employeeId: 'EMP005',
          employeeName: 'Omar Farouk',
          startDate: new Date('2024-01-01'),
          isActive: true
        }
      ],
      
      isActive: true,
      
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      createdBy: 'admin',
      updatedBy: 'admin'
    },
    {
      shiftId: 'SHIFT002',
      shiftName: 'Night Shift',
      shiftType: 'night',
      description: 'Night shift for IT support',
      
      startTime: '22:00',
      endTime: '06:00',
      duration: 8,
      
      breakConfiguration: {
        lunchBreak: {
          duration: 60,
          startTime: '01:00',
          isPaid: false
        },
        shortBreaks: [
          {
            duration: 15,
            startTime: '23:30',
            isPaid: true
          },
          {
            duration: 15,
            startTime: '03:30',
            isPaid: true
          }
        ]
      },
      
      overtimeRules: {
        dailyOvertimeThreshold: 8,
        overtimeRate: 1.5,
        maximumDailyHours: 12,
        weekendRate: 2.0,
        holidayRate: 2.5
      },
      
      applicableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      
      assignedEmployees: [],
      
      isActive: true,
      
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      createdBy: 'admin',
      updatedBy: 'admin'
    }
  ],

  // Mock biometric devices
  biometricDevices: [
    {
      deviceId: 'DEV001',
      deviceName: 'Main Entrance Biometric',
      deviceType: 'biometric',
      location: {
        building: 'Main Office',
        floor: 'Ground Floor',
        department: 'Reception',
        room: 'Main Entrance',
        address: 'Main Office - Cairo',
        coordinates: {
          latitude: 30.0444,
          longitude: 31.2357
        }
      },
      
      configuration: {
        timezone: 'Africa/Cairo',
        autoSync: true,
        syncInterval: 5,
        dataRetention: 365,
        maxUsers: 1000,
        features: ['fingerprint', 'face_recognition', 'card_reader']
      },
      
      connection: {
        ipAddress: '192.168.1.100',
        port: 8080,
        protocol: 'tcp',
        lastSync: new Date('2024-12-24T18:00:00'),
        status: 'online'
      },
      
      isActive: true,
      lastMaintenance: new Date('2024-12-01'),
      nextMaintenance: new Date('2025-01-01'),
      
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-12-24'),
      createdBy: 'admin',
      updatedBy: 'admin'
    },
    {
      deviceId: 'DEV002',
      deviceName: 'HR Department RFID',
      deviceType: 'rfid',
      location: {
        building: 'Main Office',
        floor: '2nd Floor',
        department: 'Human Resources',
        room: 'HR Office',
        address: 'Main Office - Cairo',
        coordinates: {
          latitude: 30.0444,
          longitude: 31.2357
        }
      },
      
      configuration: {
        timezone: 'Africa/Cairo',
        autoSync: true,
        syncInterval: 5,
        dataRetention: 365,
        maxUsers: 500,
        features: ['card_reader', 'pin_entry']
      },
      
      connection: {
        ipAddress: '192.168.1.101',
        port: 8080,
        protocol: 'tcp',
        lastSync: new Date('2024-12-24T18:00:00'),
        status: 'online'
      },
      
      isActive: true,
      lastMaintenance: new Date('2024-12-01'),
      nextMaintenance: new Date('2025-01-01'),
      
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-12-24'),
      createdBy: 'admin',
      updatedBy: 'admin'
    }
  ],

  // Mock attendance policies
  attendancePolicies: [
    {
      policyId: 'POL001',
      policyName: 'Standard Attendance Policy',
      description: 'Standard attendance policy for all employees',
      
      lateArrivalRules: {
        gracePeriod: 15,
        lateArrivalThreshold: 30,
        lateArrivalDeduction: {
          type: 'percentage',
          amount: 0.1
        },
        maximumLateArrivals: 5
      },
      
      earlyDepartureRules: {
        earlyDepartureThreshold: 30,
        earlyDepartureDeduction: {
          type: 'percentage',
          amount: 0.1
        },
        maximumEarlyDepartures: 5
      },
      
      absenceRules: {
        consecutiveAbsenceLimit: 3,
        monthlyAbsenceLimit: 5,
        absenceDeduction: {
          type: 'daily',
          amount: 1
        },
        requireMedicalCertificate: true,
        medicalCertificateThreshold: 3
      },
      
      overtimeRules: {
        minimumOvertimeHours: 0.5,
        overtimeCalculationMethod: 'daily',
        overtimeRate: 1.5,
        weekendRate: 2.0,
        holidayRate: 2.5,
        requireApproval: true,
        approvalWorkflow: [
          {
            level: 1,
            approverRole: 'Manager'
          },
          {
            level: 2,
            approverRole: 'HR Manager'
          }
        ]
      },
      
      breakRules: {
        mandatoryBreakDuration: 60,
        breakThreshold: 6,
        maximumBreakDuration: 120,
        unpaidBreakThreshold: 30
      },
      
      workFromHomeRules: {
        allowed: true,
        maximumDaysPerWeek: 2,
        maximumDaysPerMonth: 8,
        requireApproval: true,
        allowedDepartments: ['IT', 'Marketing', 'Sales'],
        timeTrackingRequired: true
      },
      
      applicableDepartments: ['Executive', 'Human Resources', 'IT', 'Sales', 'Marketing'],
      
      isActive: true,
      effectiveDate: new Date('2024-01-01'),
      
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      createdBy: 'admin',
      updatedBy: 'admin'
    }
  ]
};

export default attendanceDemo;
