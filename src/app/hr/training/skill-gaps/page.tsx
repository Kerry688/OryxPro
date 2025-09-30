'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Target, 
  Plus, 
  Search, 
  Filter,
  Eye,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { SkillGapAnalysis } from '@/lib/models/training';

export default function SkillGapsPage() {
  const [skillGaps, setSkillGaps] = useState<SkillGapAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');

  useEffect(() => {
    fetchSkillGaps();
  }, [searchQuery, employeeFilter, positionFilter]);

  const fetchSkillGaps = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (employeeFilter) params.append('employeeId', employeeFilter);
      if (positionFilter) params.append('positionId', positionFilter);

      const response = await fetch(`/api/hr/training/skill-gaps?${params}`);
      const data = await response.json();

      if (data.success) {
        setSkillGaps(data.data);
      } else {
        console.error('Error fetching skill gap analyses:', data.error);
      }
    } catch (error) {
      console.error('Error fetching skill gap analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'high': { 
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: <AlertTriangle className="h-3 w-3" />
      },
      'medium': { 
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Clock className="h-3 w-3" />
      },
      'low': { 
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="h-3 w-3" />
      }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
    
    return (
      <div className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
        {config.icon}
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </div>
    );
  };

  const getGapIndicator = (gap: number) => {
    if (gap === 0) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else if (gap <= 1) {
      return <Minus className="h-4 w-4 text-yellow-600" />;
    } else if (gap <= 2) {
      return <TrendingUp className="h-4 w-4 text-orange-600" />;
    } else {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
  };

  const getOverallScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading skill gap analyses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Skill Gap Analysis</h1>
          <p className="text-muted-foreground">
            Analyze skill gaps and create targeted development plans
          </p>
        </div>
        <Button asChild>
          <Link href="/hr/training/skill-gaps/new">
            <Plus className="h-4 w-4 mr-2" />
            New Analysis
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search analyses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Input
              placeholder="Employee ID"
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
            />

            <Input
              placeholder="Position ID"
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Skill Gap Analyses Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Skill Gap Analyses ({skillGaps.length})
          </CardTitle>
          <CardDescription>
            View and manage skill gap analyses for employees
          </CardDescription>
        </CardHeader>
        <CardContent>
          {skillGaps.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No skill gap analyses found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first skill gap analysis.
              </p>
              <Button asChild>
                <Link href="/hr/training/skill-gaps/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Analysis
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Overall Score</TableHead>
                  <TableHead>Skill Gaps</TableHead>
                  <TableHead>High Priority</TableHead>
                  <TableHead>Analysis Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skillGaps.map((analysis) => (
                  <TableRow key={analysis.analysisId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{analysis.employeeId}</div>
                          <div className="text-sm text-muted-foreground">
                            Analysis ID: {analysis.analysisId}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{analysis.positionId}</div>
                        <div className="text-sm text-muted-foreground">
                          Position Analysis
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className={`font-medium ${getOverallScoreColor(analysis.overallScore.current)}`}>
                            {analysis.overallScore.current}/100
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Gap: {analysis.overallScore.gap}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{analysis.gapAnalysis.length} gaps</div>
                        <div className="text-sm text-muted-foreground">
                          {analysis.gapAnalysis.filter(g => g.gap > 0).length} need attention
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {analysis.gapAnalysis.filter(g => g.priority === 'high').length > 0 ? (
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="font-medium text-red-600">
                              {analysis.gapAnalysis.filter(g => g.priority === 'high').length}
                            </span>
                          </div>
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {formatDate(analysis.analysisDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/hr/training/skill-gaps/${analysis.analysisId}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
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

      {/* Summary Cards */}
      {skillGaps.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{skillGaps.length}</div>
              <p className="text-xs text-muted-foreground">
                Completed analyses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority Gaps</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {skillGaps.reduce((total, analysis) => 
                  total + analysis.gapAnalysis.filter(g => g.priority === 'high').length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Require immediate attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(skillGaps.reduce((total, analysis) => 
                  total + analysis.overallScore.current, 0) / skillGaps.length)}
              </div>
              <p className="text-xs text-muted-foreground">
                Out of 100
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
