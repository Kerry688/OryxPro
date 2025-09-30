'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Users, 
  BarChart3, 
  RefreshCw, 
  Download, 
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  Edit,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import OrganizationChart, { CompactOrganizationChart } from '@/components/hr/OrganizationChart';
import { OrganizationChart as OrgChartModel, OrganizationNode, OrganizationStats } from '@/lib/models/organizationChart';
import { useToast } from '@/hooks/use-toast';

export default function OrganizationChartPage() {
  const { toast } = useToast();
  const [orgChart, setOrgChart] = useState<OrgChartModel | null>(null);
  const [stats, setStats] = useState<OrganizationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<OrganizationNode | null>(null);
  const [viewMode, setViewMode] = useState<'full' | 'compact'>('full');
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    fetchOrganizationChart();
    fetchStats();
  }, []);

  const fetchOrganizationChart = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/hr/organization-chart');
      if (response.ok) {
        const data = await response.json();
        setOrgChart(data.data);
        if (data.data) {
          // Auto-expand first few levels
          expandNodesToLevel(data.data.rootNode, 2);
        }
      } else {
        console.error('Failed to fetch organization chart');
      }
    } catch (error) {
      console.error('Error fetching organization chart:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/hr/organization-chart/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const expandNodesToLevel = (node: OrganizationNode, targetLevel: number, currentLevel = 0) => {
    if (currentLevel <= targetLevel) {
      setExpandedNodes(prev => new Set([...prev, node.employeeId]));
      
      if (node.children) {
        node.children.forEach(child => {
          expandNodesToLevel(child, targetLevel, currentLevel + 1);
        });
      }
    }
  };

  const handleToggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleNodeClick = (node: OrganizationNode) => {
    setSelectedNode(node);
  };

  const handleNodeEdit = (node: OrganizationNode) => {
    toast({
      title: "Edit Employee",
      description: `Edit ${node.name} - ${node.position}`,
    });
    // Navigate to employee edit page
    window.location.href = `/hr/employees/${node.employeeId}/edit`;
  };

  const handleRefresh = async () => {
    await fetchOrganizationChart();
    await fetchStats();
    toast({
      title: "Refreshed",
      description: "Organization chart has been updated.",
    });
  };

  const handleRegenerate = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/hr/organization-chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId: 'COMP001',
          name: 'Company Organization Chart',
          version: '1.0'
        }),
      });

      if (response.ok) {
        await fetchOrganizationChart();
        toast({
          title: "Success",
          description: "Organization chart has been regenerated.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to regenerate organization chart.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to regenerate organization chart.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 20, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 20, 50));
  const handleResetZoom = () => setZoom(100);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading organization chart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organization Chart</h1>
          <p className="text-muted-foreground">Visualize your company's organizational structure</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleRegenerate}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Regenerate
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                Across {stats.totalDepartments} departments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Max Depth</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.maxDepth + 1}</div>
              <p className="text-xs text-muted-foreground">
                Organizational levels
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Span of Control</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageSpanOfControl}</div>
              <p className="text-xs text-muted-foreground">
                Direct reports per manager
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDepartments}</div>
              <p className="text-xs text-muted-foreground">
                Active departments
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="chart" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="chart">Organization Chart</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          
          {/* Chart Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'full' ? 'compact' : 'full')}
            >
              {viewMode === 'full' ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              {viewMode === 'full' ? 'Compact' : 'Full'} View
            </Button>
            
            <div className="flex items-center space-x-1">
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[3rem] text-center">{zoom}%</span>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleResetZoom}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="chart" className="space-y-4">
          {orgChart ? (
            <div className="space-y-6">
              {/* Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>{orgChart.name}</CardTitle>
                  <CardDescription>
                    Last updated: {new Date(orgChart.lastUpdated).toLocaleDateString('en-US')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div 
                    className="overflow-auto border rounded-lg p-6 bg-gray-50"
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
                  >
                    <div className="flex justify-center">
                      {viewMode === 'full' ? (
                        <OrganizationChart
                          data={orgChart.rootNode}
                          onNodeClick={handleNodeClick}
                          onNodeEdit={handleNodeEdit}
                          expandedNodes={expandedNodes}
                          onToggleNode={handleToggleNode}
                        />
                      ) : (
                        <CompactOrganizationChart
                          data={orgChart.rootNode}
                          onNodeClick={handleNodeClick}
                          onNodeEdit={handleNodeEdit}
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Selected Node Details */}
              {selectedNode && (
                <Card>
                  <CardHeader>
                    <CardTitle>Employee Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-lg">{selectedNode.name}</h3>
                        <p className="text-muted-foreground">{selectedNode.position}</p>
                        <p className="text-sm text-muted-foreground">{selectedNode.department}</p>
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{selectedNode.email}</span>
                          </div>
                          {selectedNode.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{selectedNode.phone}</span>
                            </div>
                          )}
                          {selectedNode.location && (
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{selectedNode.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Team Information</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Direct Reports:</span>
                              <Badge variant="outline">{selectedNode.directReports || 0}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Team Size:</span>
                              <Badge variant="outline">{selectedNode.teamSize || 0}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Level:</span>
                              <Badge variant="outline">L{selectedNode.level}</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" asChild>
                            <a href={`/hr/employees/${selectedNode.employeeId}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </a>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <a href={`/hr/employees/${selectedNode.employeeId}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Organization Chart</h3>
                  <p className="text-muted-foreground mb-4">
                    Create an organization chart to visualize your company structure.
                  </p>
                  <Button onClick={handleRegenerate}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Generate Organization Chart
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          {stats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Department Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Department Breakdown</CardTitle>
                  <CardDescription>Employee distribution by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.departmentBreakdown.map((dept) => (
                      <div key={dept.department} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{dept.department}</p>
                          <p className="text-sm text-muted-foreground">
                            {dept.managerCount} managers
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{dept.employeeCount}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Level Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Level Breakdown</CardTitle>
                  <CardDescription>Employee distribution by organizational level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.levelBreakdown.map((level) => (
                      <div key={level.level} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{level.levelName}</p>
                          <p className="text-sm text-muted-foreground">Level {level.level}</p>
                        </div>
                        <Badge variant="outline">{level.employeeCount}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
