'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ChevronRight, 
  Mail, 
  Phone, 
  MapPin, 
  Users,
  MoreHorizontal,
  Eye,
  Edit
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { OrganizationNode } from '@/lib/models/organizationChart';

interface OrganizationChartProps {
  data: OrganizationNode;
  onNodeClick?: (node: OrganizationNode) => void;
  onNodeEdit?: (node: OrganizationNode) => void;
  expandedNodes?: Set<string>;
  onToggleNode?: (nodeId: string) => void;
  level?: number;
  maxDepth?: number;
}

export default function OrganizationChart({
  data,
  onNodeClick,
  onNodeEdit,
  expandedNodes = new Set(),
  onToggleNode,
  level = 0,
  maxDepth = 4
}: OrganizationChartProps) {
  const [isExpanded, setIsExpanded] = useState(expandedNodes.has(data.employeeId));

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    onToggleNode?.(data.employeeId);
  };

  const handleNodeClick = () => {
    onNodeClick?.(data);
  };

  const handleNodeEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNodeEdit?.(data);
  };

  const getNodeSize = (level: number) => {
    const baseSize = 200;
    const sizeReduction = level * 20;
    return Math.max(baseSize - sizeReduction, 120);
  };

  const getNodeColor = (level: number) => {
    const colors = [
      'bg-gradient-to-br from-purple-500 to-purple-700', // CEO
      'bg-gradient-to-br from-blue-500 to-blue-700',     // VP
      'bg-gradient-to-br from-green-500 to-green-700',   // Director
      'bg-gradient-to-br from-orange-500 to-orange-700', // Manager
      'bg-gradient-to-br from-teal-500 to-teal-700',     // Senior
      'bg-gradient-to-br from-gray-500 to-gray-700',     // Individual Contributor
    ];
    return colors[Math.min(level, colors.length - 1)];
  };

  const nodeSize = getNodeSize(level);
  const nodeColor = getNodeColor(level);

  return (
    <div className="flex flex-col items-center">
      {/* Node */}
      <div className="relative mb-4">
        <Card 
          className={`${nodeColor} text-white cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
          style={{ width: `${nodeSize}px`, minHeight: '140px' }}
          onClick={handleNodeClick}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <Avatar className="h-12 w-12 bg-white/20">
                <AvatarFallback className="bg-white/30 text-white font-semibold">
                  {data.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={handleNodeClick}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleNodeEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-semibold text-sm leading-tight">{data.name}</h3>
              <p className="text-xs opacity-90">{data.position}</p>
              <p className="text-xs opacity-75">{data.department}</p>
            </div>

            {/* Node Stats */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/20">
              {data.directReports && data.directReports > 0 && (
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span className="text-xs">{data.directReports}</span>
                </div>
              )}
              <Badge variant="secondary" className="text-xs bg-white/20 text-white">
                L{level}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Expand/Collapse Button */}
        {data.children && data.children.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 h-6 w-6 p-0 bg-white border border-gray-200 hover:bg-gray-50"
            onClick={handleToggle}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>

      {/* Children */}
      {data.children && data.children.length > 0 && isExpanded && (
        <div className="flex space-x-4">
          {data.children.map((child, index) => (
            <div key={child.employeeId} className="flex flex-col items-center">
              {/* Connecting Line */}
              {index > 0 && (
                <div className="absolute h-0.5 w-4 bg-gray-300 -mt-2" 
                     style={{ left: `${(index - 1) * 240}px` }} />
              )}
              
              <OrganizationChart
                data={child}
                onNodeClick={onNodeClick}
                onNodeEdit={onNodeEdit}
                expandedNodes={expandedNodes}
                onToggleNode={onToggleNode}
                level={level + 1}
                maxDepth={maxDepth}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Compact view component for smaller displays
export function CompactOrganizationChart({
  data,
  onNodeClick,
  onNodeEdit,
  level = 0
}: Omit<OrganizationChartProps, 'expandedNodes' | 'onToggleNode' | 'maxDepth'>) {
  const handleNodeClick = () => {
    onNodeClick?.(data);
  };

  const handleNodeEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNodeEdit?.(data);
  };

  return (
    <div className="flex flex-col items-center">
      <Card 
        className="w-32 h-20 bg-gradient-to-br from-blue-500 to-blue-700 text-white cursor-pointer hover:shadow-lg transition-all duration-200"
        onClick={handleNodeClick}
      >
        <CardContent className="p-2 flex flex-col justify-center items-center h-full">
          <div className="flex items-center justify-between w-full mb-1">
            <Avatar className="h-6 w-6 bg-white/20">
              <AvatarFallback className="bg-white/30 text-white text-xs font-semibold">
                {data.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-4 w-4 p-0 text-white hover:bg-white/20"
              onClick={handleNodeEdit}
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="text-center">
            <h4 className="font-semibold text-xs leading-tight">{data.name}</h4>
            <p className="text-xs opacity-90 truncate">{data.position}</p>
          </div>
        </CardContent>
      </Card>

      {/* Children */}
      {data.children && data.children.length > 0 && (
        <div className="flex space-x-2 mt-2">
          {data.children.map((child) => (
            <CompactOrganizationChart
              key={child.employeeId}
              data={child}
              onNodeClick={onNodeClick}
              onNodeEdit={onNodeEdit}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
