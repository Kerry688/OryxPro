import { CreateOrganizationChartDTO } from '@/lib/models/organizationChart';

export const egyptianOrganizationChart: CreateOrganizationChartDTO = {
  name: "PhotoEq Egypt Organization Chart",
  description: "Organizational structure for PhotoEq Egypt - Photography Equipment Sales Company",
  rootNode: {
    id: "CEO",
    employeeId: "EMP001",
    name: "أحمد عبد الرحمن المحمدي",
    title: "Chief Executive Officer",
    department: "Executive Office",
    level: 0,
    children: [
      {
        id: "SALES_DIR",
        employeeId: "EMP002",
        name: "مريم محمد السعيد",
        title: "Sales Director",
        department: "Sales Department",
        level: 1,
        children: [
          {
            id: "RETAIL_MGR",
            employeeId: "EMP008",
            name: "فاطمة سعد القاهري",
            title: "Retail Sales Manager",
            department: "Retail Sales",
            level: 2,
            children: [
              {
                id: "RETAIL_REP1",
                employeeId: "EMP011",
                name: "عمر محمد المنصوري",
                title: "Senior Sales Representative",
                department: "Retail Sales",
                level: 3,
                children: []
              },
              {
                id: "RETAIL_REP2",
                employeeId: "EMP012",
                name: "سارة عبد الله الفتحي",
                title: "Sales Representative",
                department: "Retail Sales",
                level: 3,
                children: []
              }
            ]
          },
          {
            id: "CORP_MGR",
            employeeId: "EMP009",
            name: "أمير مصطفى الاسكندراني",
            title: "Corporate Sales Manager",
            department: "Corporate Sales",
            level: 2,
            children: []
          }
        ]
      },
      {
        id: "MKTG_MGR",
        employeeId: "EMP003",
        name: "يوسف أحمد العباسي",
        title: "Marketing Manager",
        department: "Marketing Department",
        level: 1,
        children: [
          {
            id: "DIGITAL_SPEC",
            employeeId: "EMP010",
            name: "دينا أحمد الحديثي",
            title: "Digital Marketing Specialist",
            department: "Digital Marketing",
            level: 2,
            children: []
          }
        ]
      },
      {
        id: "TECH_MGR",
        employeeId: "EMP004",
        name: "نورا حسن الشريف",
        title: "Technical Support Manager",
        department: "Technical Support",
        level: 1,
        children: [
          {
            id: "TECH_SPEC",
            employeeId: "EMP013",
            name: "محمد حسن التقني",
            title: "Senior Technical Support Specialist",
            department: "Technical Support",
            level: 2,
            children: []
          }
        ]
      },
      {
        id: "CFO",
        employeeId: "EMP005",
        name: "خالد محمود الفرعوني",
        title: "Chief Financial Officer",
        department: "Finance Department",
        level: 1,
        children: [
          {
            id: "ACCOUNTANT",
            employeeId: "EMP014",
            name: "نادية أحمد المحاسبي",
            title: "Senior Accountant",
            department: "Finance Department",
            level: 2,
            children: []
          }
        ]
      },
      {
        id: "HR_MGR",
        employeeId: "EMP006",
        name: "رانيا عبد العزيز المصري",
        title: "Human Resources Manager",
        department: "Human Resources",
        level: 1,
        children: [
          {
            id: "HR_SPEC",
            employeeId: "EMP015",
            name: "كريم محمد الموظف",
            title: "HR Specialist",
            department: "Human Resources",
            level: 2,
            children: []
          }
        ]
      },
      {
        id: "OPS_MGR",
        employeeId: "EMP007",
        name: "محمد علي النوبي",
        title: "Operations Manager",
        department: "Operations",
        level: 1,
        children: []
      }
    ]
  },
  metadata: {
    totalEmployees: 15,
    totalDepartments: 11,
    maxDepth: 3,
    avgSpanOfControl: 2.1,
    lastUpdated: new Date(),
    updatedBy: "system"
  }
};

// Helper function to generate employee data for organization chart
export const generateOrganizationChartFromEmployees = () => {
  // This function would typically be used to generate the organization chart
  // from the employee data, but since we have predefined data, we return it directly
  return egyptianOrganizationChart;
};

// Department hierarchy mapping
export const departmentHierarchy = {
  "EXEC": {
    name: "Executive Office",
    level: 0,
    children: ["SALES", "MKTG", "TECH", "FIN", "HR", "OPS"]
  },
  "SALES": {
    name: "Sales Department",
    level: 1,
    children: ["RETAIL", "CORP"]
  },
  "MKTG": {
    name: "Marketing Department",
    level: 1,
    children: ["DIGITAL"]
  },
  "TECH": {
    name: "Technical Support",
    level: 1,
    children: []
  },
  "FIN": {
    name: "Finance Department",
    level: 1,
    children: []
  },
  "HR": {
    name: "Human Resources",
    level: 1,
    children: []
  },
  "OPS": {
    name: "Operations",
    level: 1,
    children: []
  },
  "RETAIL": {
    name: "Retail Sales",
    level: 2,
    children: []
  },
  "CORP": {
    name: "Corporate Sales",
    level: 2,
    children: []
  },
  "DIGITAL": {
    name: "Digital Marketing",
    level: 2,
    children: []
  }
};

// Employee to department mapping
export const employeeDepartmentMapping = {
  "EMP001": "EXEC", // CEO
  "EMP002": "SALES", // Sales Director
  "EMP003": "MKTG", // Marketing Manager
  "EMP004": "TECH", // Technical Manager
  "EMP005": "FIN", // CFO
  "EMP006": "HR", // HR Manager
  "EMP007": "OPS", // Operations Manager
  "EMP008": "RETAIL", // Retail Manager
  "EMP009": "CORP", // Corporate Sales Manager
  "EMP010": "DIGITAL", // Digital Marketing Specialist
  "EMP011": "RETAIL", // Senior Sales Representative
  "EMP012": "RETAIL", // Sales Representative
  "EMP013": "TECH", // Senior Technical Support Specialist
  "EMP014": "FIN", // Senior Accountant
  "EMP015": "HR" // HR Specialist
};
