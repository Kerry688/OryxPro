'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Clock,
  Users,
  DollarSign,
  Award,
  GraduationCap
} from 'lucide-react';
import Link from 'next/link';
import { TrainingProgram } from '@/lib/models/training';

export default function TrainingProgramsPage() {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchPrograms();
  }, [searchQuery, categoryFilter, levelFilter, statusFilter]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (categoryFilter) params.append('category', categoryFilter);
      if (levelFilter) params.append('level', levelFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/hr/training/programs?${params}`);
      const data = await response.json();

      if (data.success) {
        setPrograms(data.data);
      } else {
        console.error('Error fetching training programs:', data.error);
      }
    } catch (error) {
      console.error('Error fetching training programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      'technical': { className: 'bg-blue-100 text-blue-800 border-blue-200' },
      'soft-skills': { className: 'bg-green-100 text-green-800 border-green-200' },
      'compliance': { className: 'bg-red-100 text-red-800 border-red-200' },
      'leadership': { className: 'bg-purple-100 text-purple-800 border-purple-200' },
      'safety': { className: 'bg-orange-100 text-orange-800 border-orange-200' },
      'customer-service': { className: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
      'sales': { className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'other': { className: 'bg-gray-100 text-gray-800 border-gray-200' }
    };

    const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.other;
    
    return (
      <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
        {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
      </div>
    );
  };

  const getLevelBadge = (level: string) => {
    const levelConfig = {
      'beginner': { className: 'bg-green-100 text-green-800 border-green-200' },
      'intermediate': { className: 'bg-blue-100 text-blue-800 border-blue-200' },
      'advanced': { className: 'bg-purple-100 text-purple-800 border-purple-200' },
      'expert': { className: 'bg-red-100 text-red-800 border-red-200' }
    };

    const config = levelConfig[level as keyof typeof levelConfig] || levelConfig.beginner;
    
    return (
      <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'active': { className: 'bg-green-100 text-green-800 border-green-200' },
      'inactive': { className: 'bg-gray-100 text-gray-800 border-gray-200' },
      'archived': { className: 'bg-red-100 text-red-800 border-red-200' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    
    return (
      <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  const getDeliveryMethodIcon = (method: string) => {
    switch (method) {
      case 'in-person':
        return <Users className="h-4 w-4" />;
      case 'online':
        return <GraduationCap className="h-4 w-4" />;
      case 'hybrid':
        return <div className="flex"><Users className="h-3 w-3" /><GraduationCap className="h-3 w-3" /></div>;
      case 'self-paced':
        return <Clock className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading training programs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Training Programs</h1>
          <p className="text-muted-foreground">
            Manage training programs, curricula, and learning paths
          </p>
        </div>
        <Button asChild>
          <Link href="/hr/training/programs/new">
            <Plus className="h-4 w-4 mr-2" />
            New Program
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Categories</option>
              <option value="technical">Technical</option>
              <option value="soft-skills">Soft Skills</option>
              <option value="compliance">Compliance</option>
              <option value="leadership">Leadership</option>
              <option value="safety">Safety</option>
              <option value="customer-service">Customer Service</option>
              <option value="sales">Sales</option>
              <option value="other">Other</option>
            </select>

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Programs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Training Programs ({programs.length})
          </CardTitle>
          <CardDescription>
            Manage all training programs in your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {programs.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No training programs found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first training program.
              </p>
              <Button asChild>
                <Link href="/hr/training/programs/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Training Program
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map((program) => (
                  <TableRow key={program.programId}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{program.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {program.programId} • {program.description.substring(0, 50)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryBadge(program.category)}</TableCell>
                    <TableCell>{getLevelBadge(program.level)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {program.duration}h
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getDeliveryMethodIcon(program.deliveryMethod)}
                        <span className="capitalize">{program.deliveryMethod.replace('-', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        {program.cost.amount.toLocaleString()} {program.cost.currency}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(program.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/hr/training/programs/${program.programId}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/hr/training/programs/${program.programId}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
