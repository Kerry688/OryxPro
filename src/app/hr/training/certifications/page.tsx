'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Award, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Clock,
  DollarSign,
  Building2,
  GraduationCap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { Certification } from '@/lib/models/training';

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [issuingAuthorityFilter, setIssuingAuthorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchCertifications();
  }, [searchQuery, categoryFilter, levelFilter, issuingAuthorityFilter, statusFilter]);

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (categoryFilter) params.append('category', categoryFilter);
      if (levelFilter) params.append('level', levelFilter);
      if (issuingAuthorityFilter) params.append('issuingAuthority', issuingAuthorityFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/hr/training/certifications?${params}`);
      const data = await response.json();

      if (data.success) {
        setCertifications(data.data);
      } else {
        console.error('Error fetching certifications:', data.error);
      }
    } catch (error) {
      console.error('Error fetching certifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      'professional': { className: 'bg-blue-100 text-blue-800 border-blue-200' },
      'technical': { className: 'bg-green-100 text-green-800 border-green-200' },
      'compliance': { className: 'bg-red-100 text-red-800 border-red-200' },
      'safety': { className: 'bg-orange-100 text-orange-800 border-orange-200' },
      'industry': { className: 'bg-purple-100 text-purple-800 border-purple-200' },
      'vendor': { className: 'bg-cyan-100 text-cyan-800 border-cyan-200' }
    };

    const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.professional;
    
    return (
      <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
        {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
      </div>
    );
  };

  const getLevelBadge = (level: string) => {
    const levelConfig = {
      'foundation': { className: 'bg-green-100 text-green-800 border-green-200' },
      'associate': { className: 'bg-blue-100 text-blue-800 border-blue-200' },
      'professional': { className: 'bg-purple-100 text-purple-800 border-purple-200' },
      'expert': { className: 'bg-red-100 text-red-800 border-red-200' },
      'master': { className: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
    };

    const config = levelConfig[level as keyof typeof levelConfig] || levelConfig.foundation;
    
    return (
      <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'active': { 
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="h-3 w-3" />
      },
      'inactive': { 
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <AlertTriangle className="h-3 w-3" />
      },
      'archived': { 
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: <AlertTriangle className="h-3 w-3" />
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    
    return (
      <div className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  const getValidityPeriod = (months: number) => {
    if (months < 12) {
      return `${months} months`;
    } else if (months === 12) {
      return '1 year';
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      return remainingMonths > 0 ? `${years} years ${remainingMonths} months` : `${years} years`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading certifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Certifications</h1>
          <p className="text-muted-foreground">
            Manage certifications, track renewals, and monitor compliance
          </p>
        </div>
        <Button asChild>
          <Link href="/hr/training/certifications/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Certification
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search certifications..."
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
              <option value="professional">Professional</option>
              <option value="technical">Technical</option>
              <option value="compliance">Compliance</option>
              <option value="safety">Safety</option>
              <option value="industry">Industry</option>
              <option value="vendor">Vendor</option>
            </select>

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Levels</option>
              <option value="foundation">Foundation</option>
              <option value="associate">Associate</option>
              <option value="professional">Professional</option>
              <option value="expert">Expert</option>
              <option value="master">Master</option>
            </select>

            <Input
              placeholder="Issuing Authority"
              value={issuingAuthorityFilter}
              onChange={(e) => setIssuingAuthorityFilter(e.target.value)}
            />

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

      {/* Certifications Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Certifications ({certifications.length})
          </CardTitle>
          <CardDescription>
            Manage all certifications and track compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {certifications.length === 0 ? (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No certifications found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first certification.
              </p>
              <Button asChild>
                <Link href="/hr/training/certifications/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Certification
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Certification</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Issuing Authority</TableHead>
                  <TableHead>Validity</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certifications.map((certification) => (
                  <TableRow key={certification.certificationId}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{certification.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {certification.certificationId} • {certification.description.substring(0, 50)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryBadge(certification.category)}</TableCell>
                    <TableCell>{getLevelBadge(certification.level)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{certification.issuingAuthority}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {getValidityPeriod(certification.validityPeriod)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        {certification.cost.amount.toLocaleString()} {certification.cost.currency}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(certification.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/hr/training/certifications/${certification.certificationId}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/hr/training/certifications/${certification.certificationId}/edit`}>
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
