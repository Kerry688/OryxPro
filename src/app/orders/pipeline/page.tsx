'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  Truck,
  User,
  Calendar,
  Activity,
  FileText,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Plus,
  RefreshCw,
  Play,
  Pause,
  Square,
  ArrowRight,
  ArrowDown,
  Settings,
  BarChart3,
  TrendingUp,
  Users,
  Timer,
  Zap,
  Target,
  Workflow
} from 'lucide-react';
import { 
  salesOrders, 
  orderPipelineInstances, 
  orderPipelines, 
  pipelineStages, 
  pipelineTransitions 
} from '@/lib/data';
import type { 
  SalesOrder, 
  OrderPipelineInstance, 
  OrderPipeline, 
  PipelineStage, 
  PipelineTransition 
} from '@/lib/data';

export default function OrderPipelinePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPipeline, setSelectedPipeline] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isStageActionDialogOpen, setIsStageActionDialogOpen] = useState(false);
  const [selectedPipelineInstance, setSelectedPipelineInstance] = useState<OrderPipelineInstance | null>(null);

  // Get pipeline instances with order data
  const pipelineInstancesWithOrders = useMemo(() => {
    return orderPipelineInstances.map(instance => {
      const order = salesOrders.find(o => o.id === instance.orderId);
      const pipeline = orderPipelines.find(p => p.id === instance.pipelineId);
      const currentStage = pipelineStages.find(s => s.id === instance.currentStageId);
      
      return {
        ...instance,
        order,
        pipeline,
        currentStage
      };
    }).filter(item => item.order && item.pipeline && item.currentStage);
  }, []);

  // Filter pipeline instances
  const filteredInstances = useMemo(() => {
    return pipelineInstancesWithOrders.filter(instance => {
      const matchesSearch = 
        instance.order?.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instance.order?.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instance.order?.customer?.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPipeline = selectedPipeline === 'all' || instance.pipelineId === selectedPipeline;
      const matchesStage = selectedStage === 'all' || instance.currentStageId === selectedStage;
      
      return matchesSearch && matchesPipeline && matchesStage;
    });
  }, [pipelineInstancesWithOrders, searchTerm, selectedPipeline, selectedStage]);

  // Calculate pipeline statistics
  const stats = useMemo(() => {
    const totalInstances = pipelineInstancesWithOrders.length;
    const activeInstances = pipelineInstancesWithOrders.filter(i => !i.isCompleted).length;
    const completedInstances = pipelineInstancesWithOrders.filter(i => i.isCompleted).length;
    const overdueInstances = pipelineInstancesWithOrders.filter(i => {
      if (i.isCompleted || !i.estimatedCompletionAt) return false;
      return new Date(i.estimatedCompletionAt) < new Date();
    }).length;

    // Stage distribution
    const stageDistribution = pipelineStages.reduce((acc, stage) => {
      const count = pipelineInstancesWithOrders.filter(i => i.currentStageId === stage.id).length;
      acc[stage.name] = count;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalInstances,
      activeInstances,
      completedInstances,
      overdueInstances,
      stageDistribution
    };
  }, [pipelineInstancesWithOrders]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStageIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      FileText,
      Clock,
      CheckCircle,
      Package,
      Search,
      Truck,
      User,
      Activity
    };
    return iconMap[iconName] || FileText;
  };

  const isOverdue = (instance: OrderPipelineInstance) => {
    if (instance.isCompleted || !instance.estimatedCompletionAt) return false;
    return new Date(instance.estimatedCompletionAt) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Order Pipeline</h1>
          <p className="text-muted-foreground">
            Visualize and manage order workflows through pipeline stages
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isStageActionDialogOpen} onOpenChange={setIsStageActionDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Play className="h-4 w-4 mr-2" />
                Stage Action
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Execute Stage Action</DialogTitle>
                <DialogDescription>
                  Move orders through pipeline stages
                </DialogDescription>
              </DialogHeader>
              <StageActionForm onClose={() => setIsStageActionDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInstances}</div>
            <p className="text-xs text-muted-foreground">
              In pipeline
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeInstances}</div>
            <p className="text-xs text-muted-foreground">
              Currently processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedInstances}</div>
            <p className="text-xs text-muted-foreground">
              Successfully finished
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdueInstances}</div>
            <p className="text-xs text-muted-foreground">
              Past estimated completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Overview</CardTitle>
          <CardDescription>
            Visual representation of orders flowing through pipeline stages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Pipeline Stages */}
            <div className="flex flex-wrap gap-4 justify-center">
              {pipelineStages.map((stage, index) => {
                const Icon = getStageIcon(stage.icon);
                const orderCount = stats.stageDistribution[stage.name] || 0;
                
                return (
                  <div key={stage.id} className="flex items-center">
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${stage.color} mb-2`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="text-sm font-medium">{stage.name}</div>
                      <div className="text-xs text-muted-foreground">{orderCount} orders</div>
                    </div>
                    {index < pipelineStages.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Stage Distribution Chart */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {pipelineStages.map((stage) => {
                const orderCount = stats.stageDistribution[stage.name] || 0;
                const percentage = stats.totalInstances > 0 ? (orderCount / stats.totalInstances) * 100 : 0;
                
                return (
                  <div key={stage.id} className="text-center">
                    <div className="text-2xl font-bold">{orderCount}</div>
                    <div className="text-xs text-muted-foreground">{stage.name}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Orders</CardTitle>
          <CardDescription>
            Manage orders flowing through the pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders, customers, or order numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedPipeline} onValueChange={setSelectedPipeline}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Pipeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pipelines</SelectItem>
                {orderPipelines.map(pipeline => (
                  <SelectItem key={pipeline.id} value={pipeline.id}>
                    {pipeline.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {pipelineStages.map(stage => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Orders Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Pipeline</TableHead>
                  <TableHead>Current Stage</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Est. Completion</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstances.map((instance) => (
                  <TableRow key={instance.id} className={isOverdue(instance) ? 'bg-red-50' : ''}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{instance.order?.orderNumber}</div>
                        {isOverdue(instance) && (
                          <Badge variant="destructive" className="text-xs">
                            Overdue
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{instance.order?.customer?.name}</div>
                        <div className="text-sm text-muted-foreground">{instance.order?.customer?.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {instance.pipeline?.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {instance.currentStage && (() => {
                          const Icon = getStageIcon(instance.currentStage.icon);
                          return <Icon className="h-4 w-4" />;
                        })()}
                        <Badge className={instance.currentStage?.color}>
                          {instance.currentStage?.name}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ 
                            width: `${((instance.currentStage?.order || 1) / pipelineStages.length) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {instance.currentStage?.order} of {pipelineStages.length} stages
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(instance.startedAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {instance.estimatedCompletionAt ? formatDate(instance.estimatedCompletionAt) : '-'}
                      </div>
                      {isOverdue(instance) && (
                        <div className="text-xs text-red-600">
                          {Math.ceil((new Date().getTime() - new Date(instance.estimatedCompletionAt!).getTime()) / (1000 * 60 * 60 * 24))} days overdue
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedOrder(instance.order!);
                            setSelectedPipelineInstance(instance);
                            setIsViewDialogOpen(true);
                          }}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Pipeline
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Play className="h-4 w-4 mr-2" />
                            Advance Stage
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause Pipeline
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Add Note
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="h-4 w-4 mr-2" />
                            Pipeline Settings
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredInstances.length === 0 && (
            <div className="text-center py-8">
              <Workflow className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No pipeline orders found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedPipeline !== 'all' || selectedStage !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'No orders are currently in the pipeline'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pipeline Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="!max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pipeline Details</DialogTitle>
            <DialogDescription>
              View detailed pipeline progress and history
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && selectedPipelineInstance && (
            <PipelineDetails 
              order={selectedOrder} 
              instance={selectedPipelineInstance}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Stage Action Form Component
function StageActionForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    orderId: '',
    action: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Executing stage action:', formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="orderId">Order Number</Label>
        <Input
          id="orderId"
          value={formData.orderId}
          onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
          placeholder="Enter order number"
          required
        />
      </div>

      <div>
        <Label htmlFor="action">Action</Label>
        <Select value={formData.action} onValueChange={(value) => setFormData({ ...formData, action: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="advance">Advance to Next Stage</SelectItem>
            <SelectItem value="skip">Skip Current Stage</SelectItem>
            <SelectItem value="pause">Pause Pipeline</SelectItem>
            <SelectItem value="resume">Resume Pipeline</SelectItem>
            <SelectItem value="rollback">Rollback to Previous Stage</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          placeholder="Additional notes..."
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Execute Action
        </Button>
      </div>
    </form>
  );
}

// Pipeline Details Component
function PipelineDetails({ 
  order, 
  instance 
}: { 
  order: SalesOrder; 
  instance: OrderPipelineInstance;
}) {
  const pipeline = orderPipelines.find(p => p.id === instance.pipelineId);
  const currentStage = pipelineStages.find(s => s.id === instance.currentStageId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStageIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      FileText,
      Clock,
      CheckCircle,
      Package,
      Search,
      Truck,
      User,
      Activity
    };
    return iconMap[iconName] || FileText;
  };

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="pipeline">Pipeline Flow</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Order Number</Label>
                <p className="text-sm text-muted-foreground">{order.orderNumber}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Customer</Label>
                <p className="text-sm text-muted-foreground">{order.customer?.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Total Amount</Label>
                <p className="text-sm text-muted-foreground">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(order.totalAmount)}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Priority</Label>
                <p className="text-sm text-muted-foreground capitalize">{order.priority}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pipeline Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Pipeline</Label>
                <p className="text-sm text-muted-foreground">{pipeline?.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Current Stage</Label>
                <div className="flex items-center space-x-2">
                  {currentStage && (() => {
                    const Icon = getStageIcon(currentStage.icon);
                    return <Icon className="h-4 w-4" />;
                  })()}
                  <Badge className={currentStage?.color}>
                    {currentStage?.name}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Started</Label>
                <p className="text-sm text-muted-foreground">{formatDate(instance.startedAt)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Est. Completion</Label>
                <p className="text-sm text-muted-foreground">
                  {instance.estimatedCompletionAt ? formatDate(instance.estimatedCompletionAt) : 'Not set'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="pipeline" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipeline?.stages.map((stage, index) => {
                const Icon = getStageIcon(stage.icon);
                const isCompleted = instance.stageHistory.some(h => h.stageId === stage.id && h.exitedAt);
                const isCurrent = stage.id === instance.currentStageId;
                const isUpcoming = stage.order > (currentStage?.order || 0);
                
                return (
                  <div key={stage.id} className="flex items-center space-x-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                      isCompleted ? 'bg-green-100 text-green-800' :
                      isCurrent ? 'bg-blue-100 text-blue-800' :
                      isUpcoming ? 'bg-gray-100 text-gray-400' :
                      stage.color
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{stage.name}</h3>
                        <div className="flex items-center space-x-2">
                          {isCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {isCurrent && <Clock className="h-4 w-4 text-blue-600" />}
                          {stage.estimatedDuration && (
                            <Badge variant="outline" className="text-xs">
                              {stage.estimatedDuration}h
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{stage.description}</p>
                      {isCurrent && stage.conditions && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {stage.conditions.requiresApproval && (
                            <Badge variant="secondary" className="text-xs">Requires Approval</Badge>
                          )}
                          {stage.conditions.requiresPayment && (
                            <Badge variant="secondary" className="text-xs">Requires Payment</Badge>
                          )}
                          {stage.conditions.requiresInventory && (
                            <Badge variant="secondary" className="text-xs">Requires Inventory</Badge>
                          )}
                          {stage.conditions.requiresCustomerAction && (
                            <Badge variant="secondary" className="text-xs">Customer Action</Badge>
                          )}
                        </div>
                      )}
                    </div>
                    {index < pipeline.stages.length - 1 && (
                      <ArrowDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Stage History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {instance.stageHistory.map((history, index) => {
                const stage = pipelineStages.find(s => s.id === history.stageId);
                const Icon = stage ? getStageIcon(stage.icon) : FileText;
                
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <p className="font-medium">{stage?.name || 'Unknown Stage'}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(history.enteredAt)}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Entered by: {history.enteredBy}
                      </p>
                      {history.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{history.notes}</p>
                      )}
                      {history.exitedAt && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Exited: {formatDate(history.exitedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

