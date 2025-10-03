'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Plus,
  Search,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar,
  User,
  Building,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Target,
  BarChart3,
  Settings,
  Filter,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  GripVertical
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Deal, DealStatus, DealStage, DealPriority, DealType } from '@/lib/models/deal';
import Link from 'next/link';
import { format } from 'date-fns';

interface PipelineStage {
  stage: DealStage;
  name: string;
  color: string;
  deals: Deal[];
  totalValue: number;
  dealCount: number;
}

export default function SalesPipelinePage() {
  const { toast } = useToast();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<DealPriority | 'all'>('all');
  const [selectedType, setSelectedType] = useState<DealType | 'all'>('all');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    value: 0,
    probability: 10,
    expectedCloseDate: new Date(),
    currency: 'USD',
    type: 'new_business' as DealType,
    priority: 'medium' as DealPriority,
    stage: 'lead' as DealStage,
    status: 'prospecting' as DealStatus,
    nextSteps: '',
    notes: '',
    tags: []
  });

  const pipelineStages: PipelineStage[] = [
    {
      stage: 'lead',
      name: 'Lead',
      color: 'bg-blue-100 border-blue-200',
      deals: [],
      totalValue: 0,
      dealCount: 0
    },
    {
      stage: 'opportunity',
      name: 'Opportunity',
      color: 'bg-yellow-100 border-yellow-200',
      deals: [],
      totalValue: 0,
      dealCount: 0
    },
    {
      stage: 'proposal',
      name: 'Proposal',
      color: 'bg-purple-100 border-purple-200',
      deals: [],
      totalValue: 0,
      dealCount: 0
    },
    {
      stage: 'negotiation',
      name: 'Negotiation',
      color: 'bg-orange-100 border-orange-200',
      deals: [],
      totalValue: 0,
      dealCount: 0
    },
    {
      stage: 'closed',
      name: 'Closed',
      color: 'bg-green-100 border-green-200',
      deals: [],
      totalValue: 0,
      dealCount: 0
    }
  ];

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/deals');
      const result = await response.json();
      if (result.success) {
        setDeals(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch deals",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
      toast({
        title: "Network Error",
        description: "Failed to fetch deals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      const matchesSearch =
        deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.dealNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPriority = selectedPriority === 'all' || deal.priority === selectedPriority;
      const matchesType = selectedType === 'all' || deal.type === selectedType;

      return matchesSearch && matchesPriority && matchesType;
    });
  }, [deals, searchTerm, selectedPriority, selectedType]);

  const pipelineData = useMemo(() => {
    const stages = pipelineStages.map(stage => ({
      ...stage,
      deals: filteredDeals.filter(deal => deal.stage === stage.stage),
      totalValue: 0,
      dealCount: 0
    }));

    // Calculate totals
    stages.forEach(stage => {
      stage.totalValue = stage.deals.reduce((sum, deal) => sum + deal.value, 0);
      stage.dealCount = stage.deals.length;
    });

    return stages;
  }, [filteredDeals]);

  const totalStats = useMemo(() => {
    const totalDeals = filteredDeals.length;
    const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0);
    const wonDeals = filteredDeals.filter(deal => deal.status === 'closed_won').length;
    const wonValue = filteredDeals.filter(deal => deal.status === 'closed_won').reduce((sum, deal) => sum + deal.value, 0);
    const averageDealSize = totalDeals > 0 ? totalValue / totalDeals : 0;
    const winRate = totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0;

    return {
      totalDeals,
      totalValue,
      wonDeals,
      wonValue,
      averageDealSize,
      winRate
    };
  }, [filteredDeals]);

  const getStatusColor = (status: DealStatus) => {
    switch (status) {
      case 'prospecting': return 'bg-blue-100 text-blue-800';
      case 'qualification': return 'bg-yellow-100 text-yellow-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'closed_won': return 'bg-green-100 text-green-800';
      case 'closed_lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: DealPriority) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: Date) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Deal Created",
          description: `Deal ${result.data.dealNumber} created successfully`,
        });
        setIsCreateDialogOpen(false);
        setFormData({
          name: '',
          description: '',
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          value: 0,
          probability: 10,
          expectedCloseDate: new Date(),
          currency: 'USD',
          type: 'new_business',
          priority: 'medium',
          stage: 'lead',
          status: 'prospecting',
          nextSteps: '',
          notes: '',
          tags: []
        });
        fetchDeals();
      } else {
        toast({
          title: "Error Creating Deal",
          description: result.error || "Failed to create deal",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating deal:', error);
      toast({
        title: "Network Error",
        description: "Failed to create deal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStageChange = async (dealId: string, newStage: DealStage) => {
    try {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stage: newStage }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Deal Updated",
          description: "Deal stage updated successfully",
        });
        fetchDeals();
      } else {
        toast({
          title: "Error Updating Deal",
          description: result.error || "Failed to update deal stage",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating deal:', error);
      toast({
        title: "Network Error",
        description: "Failed to update deal. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Pipeline</h1>
          <p className="text-muted-foreground">
            Visual pipeline management and deal tracking
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={fetchDeals}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Pipeline Settings</DialogTitle>
                <DialogDescription>
                  Configure your sales pipeline stages and settings
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Pipeline Stages</Label>
                  <div className="space-y-2 mt-2">
                    {pipelineStages.map((stage, index) => (
                      <div key={stage.stage} className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded ${stage.color}`}></div>
                        <span className="text-sm">{stage.name}</span>
                        <Badge variant="outline">{stage.dealCount} deals</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Deal</DialogTitle>
                <DialogDescription>
                  Add a new deal to your sales pipeline
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateDeal} className="space-y-4">
                <div>
                  <Label htmlFor="name">Deal Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerEmail">Customer Email</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="value">Deal Value *</Label>
                    <Input
                      id="value"
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="probability">Probability (%)</Label>
                    <Input
                      id="probability"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.probability}
                      onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => setFormData({ ...formData, currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="type">Deal Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: DealType) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new_business">New Business</SelectItem>
                        <SelectItem value="upsell">Upsell</SelectItem>
                        <SelectItem value="cross_sell">Cross Sell</SelectItem>
                        <SelectItem value="renewal">Renewal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: DealPriority) => setFormData({ ...formData, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="stage">Initial Stage</Label>
                    <Select
                      value={formData.stage}
                      onValueChange={(value: DealStage) => setFormData({ ...formData, stage: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="opportunity">Opportunity</SelectItem>
                        <SelectItem value="proposal">Proposal</SelectItem>
                        <SelectItem value="negotiation">Negotiation</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="expectedCloseDate">Expected Close Date *</Label>
                  <Input
                    id="expectedCloseDate"
                    type="date"
                    value={formData.expectedCloseDate.toISOString().split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, expectedCloseDate: new Date(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nextSteps">Next Steps</Label>
                  <Textarea
                    id="nextSteps"
                    value={formData.nextSteps}
                    onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Deal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalDeals}</div>
            <p className="text-xs text-muted-foreground">
              All pipeline deals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalStats.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Total pipeline value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Won Deals</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.wonDeals}</div>
            <p className="text-xs text-muted-foreground">
              Successfully closed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Won Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalStats.wonValue)}</div>
            <p className="text-xs text-muted-foreground">
              Revenue generated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalStats.averageDealSize)}</div>
            <p className="text-xs text-muted-foreground">
              Average deal value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(totalStats.winRate)}%</div>
            <p className="text-xs text-muted-foreground">
              Success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Filters</CardTitle>
          <CardDescription>
            Filter deals to focus on specific criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search deals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedPriority} onValueChange={(value: DealPriority | 'all') => setSelectedPriority(value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={(value: DealType | 'all') => setSelectedType(value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="new_business">New Business</SelectItem>
                <SelectItem value="upsell">Upsell</SelectItem>
                <SelectItem value="cross_sell">Cross Sell</SelectItem>
                <SelectItem value="renewal">Renewal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Visualization */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Sales Pipeline</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {pipelineData.map((stage, index) => (
            <Card key={stage.stage} className={`${stage.color} min-h-[600px]`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {stage.dealCount}
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  {formatCurrency(stage.totalValue)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {stage.deals.map((deal) => (
                  <Card key={deal._id.toString()} className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium truncate">{deal.name}</h4>
                            <p className="text-xs text-muted-foreground">{deal.customerName || 'No customer'}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-6 w-6 p-0">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedDeal(deal);
                                setIsViewDialogOpen(true);
                              }}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Deal
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Phone className="h-4 w-4 mr-2" />
                                Call Customer
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {index > 0 && (
                                <DropdownMenuItem onClick={() => handleStageChange(deal._id.toString(), pipelineData[index - 1].stage)}>
                                  <ArrowLeft className="h-4 w-4 mr-2" />
                                  Move Left
                                </DropdownMenuItem>
                              )}
                              {index < pipelineData.length - 1 && (
                                <DropdownMenuItem onClick={() => handleStageChange(deal._id.toString(), pipelineData[index + 1].stage)}>
                                  <ArrowRight className="h-4 w-4 mr-2" />
                                  Move Right
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium">{formatCurrency(deal.value)}</span>
                            <Badge className={getPriorityColor(deal.priority)} variant="outline">
                              {deal.priority}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-1">
                              <div 
                                className="bg-blue-600 h-1 rounded-full" 
                                style={{ width: `${deal.probability}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-muted-foreground">{deal.probability}%</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatDate(deal.expectedCloseDate)}
                            </span>
                            <Badge className={getStatusColor(deal.status)} variant="outline">
                              {deal.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {stage.deals.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No deals in this stage</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Deal Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Deal Details</DialogTitle>
            <DialogDescription>
              View and manage deal information
            </DialogDescription>
          </DialogHeader>
          {selectedDeal && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Deal Number</Label>
                  <p className="text-sm text-muted-foreground">{selectedDeal.dealNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedDeal.status)}>
                    {selectedDeal.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Deal Name</Label>
                <p className="text-sm text-muted-foreground">{selectedDeal.name}</p>
              </div>
              {selectedDeal.description && (
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground">{selectedDeal.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Customer</Label>
                  <p className="text-sm text-muted-foreground">{selectedDeal.customerName || '-'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{selectedDeal.customerEmail || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Value</Label>
                  <p className="text-sm text-muted-foreground">{formatCurrency(selectedDeal.value)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Probability</Label>
                  <p className="text-sm text-muted-foreground">{selectedDeal.probability}%</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Expected Close</Label>
                  <p className="text-sm text-muted-foreground">{formatDate(selectedDeal.expectedCloseDate)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Stage</Label>
                  <Badge className={getStatusColor(selectedDeal.status)}>
                    {selectedDeal.stage.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <Badge className={getPriorityColor(selectedDeal.priority)}>
                    {selectedDeal.priority}
                  </Badge>
                </div>
              </div>
              {selectedDeal.nextSteps && (
                <div>
                  <Label className="text-sm font-medium">Next Steps</Label>
                  <p className="text-sm text-muted-foreground">{selectedDeal.nextSteps}</p>
                </div>
              )}
              {selectedDeal.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm text-muted-foreground">{selectedDeal.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
