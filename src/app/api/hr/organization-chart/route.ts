import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { OrganizationChart, CreateOrganizationChartDTO, OrganizationNode } from '@/lib/models/organizationChart';
import { ObjectId } from 'mongodb';

// GET /api/hr/organization-chart - Get organization chart
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const orgChartCollection = db.collection('organizationCharts');
    const employeesCollection = db.collection('employees');

    // Get the active organization chart
    const orgChart = await orgChartCollection.findOne({
      'systemInfo.isActive': true
    });

    if (!orgChart) {
      // If no org chart exists, generate one from employees
      const employees = await employeesCollection.find({
        'systemInfo.isActive': true,
        'employmentInfo.employmentStatus': 'active'
      }).toArray();

      if (employees.length === 0) {
        return NextResponse.json({
          success: true,
          data: null,
          message: 'No employees found to create organization chart'
        });
      }

      // Generate organization chart from employees
      const generatedChart = await generateOrganizationChart(employees);
      return NextResponse.json({
        success: true,
        data: generatedChart
      });
    }

    return NextResponse.json({
      success: true,
      data: orgChart
    });
  } catch (error) {
    console.error('Error fetching organization chart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch organization chart' },
      { status: 500 }
    );
  }
}

// POST /api/hr/organization-chart - Create or update organization chart
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const orgChartCollection = db.collection('organizationCharts');
    const employeesCollection = db.collection('employees');

    const chartData: CreateOrganizationChartDTO = await request.json();

    // Get all active employees
    const employees = await employeesCollection.find({
      'systemInfo.isActive': true
    }).toArray();

    console.log('Found', employees.length, 'active employees');

    if (employees.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No employees found to create organization chart' },
        { status: 400 }
      );
    }

    // Generate organization chart
    const generatedChart = await generateOrganizationChart(employees, chartData);

    // Save or update organization chart
    const existingChart = await orgChartCollection.findOne({
      'systemInfo.isActive': true
    });

    if (existingChart) {
      // Update existing chart - merge systemInfo properly
      const updateData = {
        ...generatedChart,
        systemInfo: {
          ...existingChart.systemInfo,
          updatedBy: 'system',
          updatedAt: new Date()
        }
      };
      
      const result = await orgChartCollection.findOneAndUpdate(
        { _id: existingChart._id },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      
      // Update the generatedChart with the result
      if (result) {
        Object.assign(generatedChart, result);
      }
    } else {
      // Create new chart
      const result = await orgChartCollection.insertOne(generatedChart);
      generatedChart._id = result.insertedId;
    }

    return NextResponse.json({
      success: true,
      data: generatedChart,
      message: 'Organization chart updated successfully'
    });
  } catch (error) {
    console.error('Error creating organization chart:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create organization chart',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to generate organization chart from employees
async function generateOrganizationChart(employees: any[], chartData?: CreateOrganizationChartDTO) {
  console.log('Generating organization chart for', employees.length, 'employees');
  
  // Convert employees to organization nodes
  const nodes: OrganizationNode[] = employees.map(employee => {
    try {
      // Validate required fields
      if (!employee.employeeId) {
        console.error('Employee missing employeeId:', employee);
        return null;
      }
      if (!employee.personalInfo?.firstName || !employee.personalInfo?.lastName) {
        console.error('Employee missing personalInfo:', employee.employeeId);
        return null;
      }
      if (!employee.employmentInfo?.jobTitle) {
        console.error('Employee missing employmentInfo.jobTitle:', employee.employeeId);
        return null;
      }

      return {
        employeeId: employee.employeeId,
        name: `${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`,
        position: employee.employmentInfo.jobTitle,
        department: employee.employmentInfo.departmentId || 'Unknown',
        level: 0, // Will be calculated based on hierarchy
        parentId: employee.employmentInfo.reportingManager,
        email: employee.personalInfo.email || '',
        phone: employee.personalInfo.phone || '',
        location: employee.employmentInfo.workLocation || '',
        isActive: employee.employmentInfo.employmentStatus === 'active',
        hireDate: employee.employmentInfo.hireDate || new Date(),
        directReports: 0,
        teamSize: 0
      };
    } catch (error) {
      console.error('Error processing employee:', employee.employeeId, error);
      return null;
    }
  }).filter(node => node !== null) as OrganizationNode[];

  if (nodes.length === 0) {
    throw new Error('No valid employees found to create organization chart');
  }

  // Find root node (CEO or top-level manager)
  const rootNode = nodes.find(node => !node.parentId) || nodes[0];
  
  // Build hierarchy
  const hierarchy = buildHierarchy(nodes, rootNode.employeeId);
  
  // Calculate levels and team sizes
  calculateLevelsAndTeamSizes(hierarchy);

  const orgChart: OrganizationChart = {
    companyId: chartData?.companyId || 'COMP001',
    name: chartData?.name || 'Company Organization Chart',
    version: chartData?.version || '1.0',
    lastUpdated: new Date(),
    rootNode: hierarchy,
    totalEmployees: nodes.length,
    totalDepartments: new Set(nodes.map(n => n.department)).size,
    maxDepth: getMaxDepth(hierarchy),
    systemInfo: {
      createdBy: 'system',
      createdAt: new Date(),
      updatedBy: 'system',
      updatedAt: new Date(),
      isActive: true
    }
  };

  return orgChart;
}

// Helper function to build hierarchy tree
function buildHierarchy(nodes: OrganizationNode[], rootId: string): OrganizationNode {
  const nodeMap = new Map(nodes.map(node => [node.employeeId, node]));
  const rootNode = nodeMap.get(rootId);
  
  if (!rootNode) return nodes[0];

  function buildChildren(parentId: string): OrganizationNode[] {
    return nodes
      .filter(node => node.parentId === parentId)
      .map(node => ({
        ...node,
        children: buildChildren(node.employeeId)
      }));
  }

  return {
    ...rootNode,
    children: buildChildren(rootId)
  };
}

// Helper function to calculate levels and team sizes
function calculateLevelsAndTeamSizes(node: OrganizationNode, level: number = 0): void {
  node.level = level;
  
  if (node.children && node.children.length > 0) {
    node.directReports = node.children.length;
    node.teamSize = node.children.length;
    
    node.children.forEach(child => {
      calculateLevelsAndTeamSizes(child, level + 1);
      node.teamSize! += child.teamSize || 0;
    });
  } else {
    node.directReports = 0;
    node.teamSize = 0;
  }
}

// Helper function to get maximum depth of the tree
function getMaxDepth(node: OrganizationNode): number {
  if (!node.children || node.children.length === 0) {
    return node.level;
  }
  
  return Math.max(...node.children.map(child => getMaxDepth(child)));
}
