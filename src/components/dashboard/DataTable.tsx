'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Eye,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  title: string;
  subtitle?: string;
  columns: TableColumn[];
  data: any[];
  actions?: React.ReactNode;
  className?: string;
}

export function DataTable({ 
  title, 
  subtitle, 
  columns, 
  data, 
  actions,
  className 
}: DataTableProps) {
  return (
    <Card className={cn("relative", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {actions}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="text-left py-3 px-4 text-sm font-medium text-muted-foreground"
                  >
                    {column.label}
                  </th>
                ))}
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                  {columns.map((column) => (
                    <td key={column.key} className="py-3 px-4">
                      {column.render 
                        ? column.render(row[column.key], row)
                        : row[column.key]
                      }
                    </td>
                  ))}
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProjectRow {
  name: string;
  manager: string;
  budget: string;
  progress: number;
  status: 'completed' | 'in-progress' | 'on-hold';
  trend: number;
}

export function ProjectsTable({ data }: { data: ProjectRow[] }) {
  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Project',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary">
              {value.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-muted-foreground">{row.manager}</div>
          </div>
        </div>
      )
    },
    {
      key: 'budget',
      label: 'Budget',
      render: (value) => (
        <div className="font-medium">{value}</div>
      )
    },
    {
      key: 'progress',
      label: 'Progress',
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-sm font-medium">{value}%</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge 
          variant={
            value === 'completed' ? 'default' :
            value === 'in-progress' ? 'secondary' : 'destructive'
          }
        >
          {value === 'completed' ? 'Completed' :
           value === 'in-progress' ? 'In Progress' : 'On Hold'}
        </Badge>
      )
    },
    {
      key: 'trend',
      label: 'Trend',
      render: (value) => (
        <div className="flex items-center space-x-1">
          {value > 0 ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
          <span className={cn(
            "text-sm font-medium",
            value > 0 ? "text-green-600" : "text-red-600"
          )}>
            {value > 0 ? '+' : ''}{value}%
          </span>
        </div>
      )
    }
  ];

  return (
    <DataTable
      title="Projects Stats"
      subtitle="Updated 37 minutes ago"
      columns={columns}
      data={data}
      actions={
        <Button variant="outline" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      }
    />
  );
}
