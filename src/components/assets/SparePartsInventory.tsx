'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  AlertTriangle,
  CheckCircle,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  BarChart3
} from 'lucide-react';

export function SparePartsInventory() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Spare Parts Inventory</h2>
          <p className="text-muted-foreground">
            Manage spare parts and consumables for maintenance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Part
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parts</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              In inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              Below reorder point
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Critical items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,678</div>
            <p className="text-xs text-muted-foreground">
              Total value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Critical Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium">Server RAM - 8GB DDR4</p>
                  <p className="text-sm text-gray-600">Out of stock - 0 remaining</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Reorder</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium">Printer Toner Cartridge</p>
                  <p className="text-sm text-gray-600">Low stock - 2 remaining (reorder at 5)</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Reorder</Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium">Network Cable - Cat6</p>
                  <p className="text-sm text-gray-600">Low stock - 3 remaining (reorder at 10)</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Reorder</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parts List */}
      <Card>
        <CardHeader>
          <CardTitle>Spare Parts Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">SP-001 - Server RAM 8GB DDR4</p>
                  <p className="text-sm text-muted-foreground">Compatible with Dell PowerEdge servers</p>
                  <p className="text-xs text-muted-foreground">Location: Warehouse A, Shelf B-3</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
                <div className="text-right">
                  <p className="text-sm font-medium">$89.99</p>
                  <p className="text-xs text-muted-foreground">0 / 10</p>
                </div>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">SP-002 - Printer Toner Cartridge</p>
                  <p className="text-sm text-muted-foreground">HP LaserJet Pro compatible</p>
                  <p className="text-xs text-muted-foreground">Location: Office Supply Room</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-100 text-orange-800">Low Stock</Badge>
                <div className="text-right">
                  <p className="text-sm font-medium">$45.00</p>
                  <p className="text-xs text-muted-foreground">2 / 5</p>
                </div>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">SP-003 - Network Cable Cat6</p>
                  <p className="text-sm text-muted-foreground">100ft Ethernet cable</p>
                  <p className="text-xs text-muted-foreground">Location: IT Storage Room</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-100 text-orange-800">Low Stock</Badge>
                <div className="text-right">
                  <p className="text-sm font-medium">$25.00</p>
                  <p className="text-xs text-muted-foreground">3 / 10</p>
                </div>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">SP-004 - Hard Drive 1TB SSD</p>
                  <p className="text-sm text-muted-foreground">SATA SSD for desktop computers</p>
                  <p className="text-xs text-muted-foreground">Location: Warehouse A, Shelf C-1</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                <div className="text-right">
                  <p className="text-sm font-medium">$129.99</p>
                  <p className="text-xs text-muted-foreground">15 / 20</p>
                </div>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
