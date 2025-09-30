'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Database, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Trash2,
  Eye,
  Building2,
  Tag,
  Package,
  Users,
  Network,
  Briefcase
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PhotographyBrand {
  _id: string;
  name: string;
  code: string;
  category: string;
  status: string;
  isActive: boolean;
  createdAt: string;
}

export default function SeedBrandsPage() {
  const [loading, setLoading] = useState(false);
  const [photographyBrands, setPhotographyBrands] = useState<PhotographyBrand[]>([]);
  const [seeded, setSeeded] = useState(false);
  const [categoryCount, setCategoryCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [allProductCount, setAllProductCount] = useState(0);
  const [branchCount, setBranchCount] = useState(0);
  const [hrDepartmentsCount, setHrDepartmentsCount] = useState(0);
  const [hrEmployeesCount, setHrEmployeesCount] = useState(0);
  const [hrOrgChartCount, setHrOrgChartCount] = useState(0);
  const { toast } = useToast();

  // Seed photography brands
  const seedPhotographyBrands = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/brands/seed-photography', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setSeeded(true);
        toast({
          title: "Success!",
          description: `Successfully seeded ${data.insertedCount} photography brands`,
        });
        // Refresh the brands list
        fetchPhotographyBrands();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to seed photography brands",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error seeding brands:', error);
      toast({
        title: "Error",
        description: "Failed to seed photography brands",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch existing photography brands
  const fetchPhotographyBrands = async () => {
    try {
      const response = await fetch('/api/brands/seed-photography');
      const data = await response.json();

      if (data.success) {
        setPhotographyBrands(data.brands);
        setSeeded(data.count > 0);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  // Delete all photography brands
  const deletePhotographyBrands = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/brands/seed-photography', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setSeeded(false);
        setPhotographyBrands([]);
        toast({
          title: "Success!",
          description: `Successfully deleted ${data.deletedCount} photography brands`,
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete photography brands",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting brands:', error);
      toast({
        title: "Error",
        description: "Failed to delete photography brands",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Seed photography categories
  const seedPhotographyCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories/seed-photography', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success!",
          description: `Successfully seeded ${data.insertedCount} photography categories`,
        });
        fetchCounts();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to seed photography categories",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error seeding categories:', error);
      toast({
        title: "Error",
        description: "Failed to seed photography categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Seed photography products
  const seedPhotographyProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products/seed-photography', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success!",
          description: `Successfully seeded ${data.insertedCount} photography products`,
        });
        fetchCounts();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to seed photography products",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error seeding products:', error);
      toast({
        title: "Error",
        description: "Failed to seed photography products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Seed demo branches
  const seedDemoBranches = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/branches/seed-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: data.message });
        fetchCounts(); // Refresh counts
      } else {
        toast({ title: "Error", description: data.message || "Failed to seed branches", variant: "destructive" });
      }
    } catch (error) {
      console.error('Error seeding branches:', error);
      toast({ title: "Error", description: "Failed to seed branches", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Clear all products
  const clearAllProducts = async () => {
    if (!confirm('Are you sure you want to delete ALL products from the database? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/products/clear-all', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: `Successfully deleted ${data.deletedCount} products`,
        });
        fetchCounts();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to clear products",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error clearing products:', error);
      toast({
        title: "Error",
        description: "Failed to clear products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Seed Egyptian HR data
  const seedEgyptianHRData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/hr/seed-egyptian-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success!",
          description: `Successfully seeded Egyptian HR data: ${data.data.summary.departments} departments, ${data.data.summary.employees} employees, ${data.data.summary.organizationChart} org chart`,
        });
        fetchCounts();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to seed Egyptian HR data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error seeding Egyptian HR data:', error);
      toast({
        title: "Error",
        description: "Failed to seed Egyptian HR data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Clear Egyptian HR data
  const clearEgyptianHRData = async () => {
    if (!confirm('Are you sure you want to delete ALL Egyptian HR demo data? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/hr/seed-egyptian-all', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: `Successfully deleted ${data.data.totalDeleted} Egyptian HR records`,
        });
        fetchCounts();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to clear Egyptian HR data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error clearing Egyptian HR data:', error);
      toast({
        title: "Error",
        description: "Failed to clear Egyptian HR data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch counts for all data types
  const fetchCounts = async () => {
    try {
      // Fetch categories count
      const categoriesResponse = await fetch('/api/categories/seed-photography');
      const categoriesData = await categoriesResponse.json();
      if (categoriesData.success) {
        setCategoryCount(categoriesData.count);
      }

      // Fetch products count
      const productsResponse = await fetch('/api/products/seed-photography');
      const productsData = await productsResponse.json();
      if (productsData.success) {
        setProductCount(productsData.count);
      }

      // Fetch all products count
      const allProductsResponse = await fetch('/api/products/clear-all');
      const allProductsData = await allProductsResponse.json();
      if (allProductsData.success) {
        setAllProductCount(allProductsData.count);
      }

      // Fetch branches count
      const branchesResponse = await fetch('/api/branches/seed-demo');
      const branchesData = await branchesResponse.json();
      if (branchesData.success) {
        setBranchCount(branchesData.count);
      }

      // Fetch Egyptian HR data counts
      const hrResponse = await fetch('/api/hr/seed-egyptian-all');
      const hrData = await hrResponse.json();
      if (hrData.success) {
        setHrDepartmentsCount(hrData.data.summary.departments);
        setHrEmployeesCount(hrData.data.summary.employees);
        setHrOrgChartCount(hrData.data.summary.organizationChart);
      }
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  // Load existing data on component mount
  React.useEffect(() => {
    fetchPhotographyBrands();
    fetchCounts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Demo Data Management</h1>
        <p className="text-muted-foreground">
          Manage demo data including photography industry data and Egyptian HR organizational structure
        </p>
      </div>

          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-9 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brands</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{photographyBrands.length}</div>
            <p className="text-xs text-muted-foreground">Photography brands</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryCount}</div>
            <p className="text-xs text-muted-foreground">Product categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCount}</div>
            <p className="text-xs text-muted-foreground">Photography products</p>
          </CardContent>
        </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{allProductCount}</div>
                <p className="text-xs text-muted-foreground">All products in database</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Branches</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{branchCount}</div>
                <p className="text-xs text-muted-foreground">Demo branches</p>
              </CardContent>
            </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            {photographyBrands.length > 0 && categoryCount > 0 && productCount > 0 ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {photographyBrands.length > 0 && categoryCount > 0 && productCount > 0 ? 'Complete' : 'Incomplete'}
            </div>
            <p className="text-xs text-muted-foreground">Demo data status</p>
          </CardContent>
        </Card>

        {/* HR Data Status Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">HR Departments</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hrDepartmentsCount}</div>
            <p className="text-xs text-muted-foreground">Egyptian departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">HR Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hrEmployeesCount}</div>
            <p className="text-xs text-muted-foreground">Egyptian employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Org Chart</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hrOrgChartCount}</div>
            <p className="text-xs text-muted-foreground">Organization charts</p>
          </CardContent>
        </Card>
      </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seed Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">
              Add photography product categories (Cameras, Lenses, Lighting, etc.)
            </p>
            <Button 
              onClick={seedPhotographyCategories} 
              disabled={loading || categoryCount > 0}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Tag className="mr-2 h-4 w-4" />
              )}
              {categoryCount > 0 ? 'Already Seeded' : 'Seed Categories (30)'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seed Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">
              Add photography products (cameras, lenses, accessories, services)
            </p>
            <Button 
              onClick={seedPhotographyProducts} 
              disabled={loading || productCount > 0}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Package className="mr-2 h-4 w-4" />
              )}
              {productCount > 0 ? 'Already Seeded' : 'Seed Products (25+)'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seed Brands</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">
              Add photography brands (Canon, Nikon, Sony, and more)
            </p>
            <Button 
              onClick={seedPhotographyBrands} 
              disabled={loading || seeded}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Building2 className="mr-2 h-4 w-4" />
              )}
              {seeded ? 'Already Seeded' : 'Seed Brands (15)'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clear All Products</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">
              Remove all products from the database (currently {allProductCount} products)
            </p>
            <Button 
              variant="destructive" 
              onClick={clearAllProducts} 
              disabled={loading || allProductCount === 0}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Clear All Products
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seed Branches</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">
              Add demo branches (NYC, LAX, CHI, MIA, SEA) to the database
            </p>
            <Button
              onClick={seedDemoBranches}
              disabled={loading || branchCount > 0}
              className="w-full"
            >
              {loading ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : (<Building2 className="mr-2 h-4 w-4" />)}
              Seed Demo Branches
            </Button>
          </CardContent>
        </Card>

        {/* Egyptian HR Action Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seed Egyptian HR</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">
              Add complete Egyptian HR structure (departments, employees, org chart)
            </p>
            <Button
              onClick={seedEgyptianHRData}
              disabled={loading || (hrDepartmentsCount > 0 && hrEmployeesCount > 0 && hrOrgChartCount > 0)}
              className="w-full"
            >
              {loading ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : (<Users className="mr-2 h-4 w-4" />)}
              Seed Egyptian HR Data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clear Egyptian HR</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">
              Remove all Egyptian HR demo data from the database
            </p>
            <Button
              variant="destructive"
              onClick={clearEgyptianHRData}
              disabled={loading || (hrDepartmentsCount === 0 && hrEmployeesCount === 0 && hrOrgChartCount === 0)}
              className="w-full"
            >
              {loading ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : (<Trash2 className="mr-2 h-4 w-4" />)}
              Clear Egyptian HR Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Photography Brands List */}
      {photographyBrands.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Photography Brands ({photographyBrands.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photographyBrands.map((brand) => (
                <div
                  key={brand._id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{brand.name}</h3>
                    <Badge variant={brand.isActive ? "default" : "secondary"}>
                      {brand.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Code: {brand.code}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Added: {new Date(brand.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Photography Demo Data Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Brands (15)
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Canon - DSLR and mirrorless cameras</li>
                <li>• Nikon - Professional DSLR cameras</li>
                <li>• Sony - Mirrorless and professional cameras</li>
                <li>• Fujifilm - Medium format cameras</li>
                <li>• Profoto - Professional studio lighting</li>
                <li>• Godox - Affordable lighting solutions</li>
                <li>• Manfrotto - Tripods and support</li>
                <li>• Gitzo - Premium carbon fiber tripods</li>
                <li>• SanDisk - Memory cards and storage</li>
                <li>• Peak Design - Camera bags and straps</li>
                <li>• And 5 more...</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Categories (30)
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Cameras:</strong> DSLR, Mirrorless, Medium Format</li>
                <li>• <strong>Lenses:</strong> Prime, Zoom, Macro, Telephoto</li>
                <li>• <strong>Lighting:</strong> Studio Lights, Flash Units, Modifiers</li>
                <li>• <strong>Support:</strong> Tripods, Monopods, Heads</li>
                <li>• <strong>Storage:</strong> Memory Cards, Readers, External</li>
                <li>• <strong>Accessories:</strong> Bags, Straps, Filters, Cleaning</li>
                <li>• <strong>Video:</strong> Cameras, Accessories</li>
                <li>• <strong>Services:</strong> Print Services, Photo Services</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Products (25+)
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Cameras:</strong> Canon R5, Nikon D850, Sony A7R IV</li>
                <li>• <strong>Lenses:</strong> Canon RF 24-70mm, Nikon 85mm, Sony 70-200mm</li>
                <li>• <strong>Lighting:</strong> Godox AD600Pro, Profoto A1X</li>
                <li>• <strong>Tripods:</strong> Manfrotto MT055XPRO3, Gitzo GT3543XLS</li>
                <li>• <strong>Memory:</strong> SanDisk CFexpress, Lexar SDXC</li>
                <li>• <strong>Bags:</strong> Peak Design Backpack, BlackRapid Strap</li>
                <li>• <strong>Filters:</strong> B+W UV Filter, PolarPro ND Set</li>
                <li>• <strong>Services:</strong> Photo Editing, Consultation, Printing</li>
                <li>• And more...</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Recommended Seeding Order</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. <strong>Categories first</strong> - Creates the product category structure</li>
              <li>2. <strong>Brands second</strong> - Adds manufacturer information</li>
              <li>3. <strong>Products last</strong> - Links products to categories and brands</li>
            </ol>
            <p className="text-xs text-blue-700 mt-2">
              This ensures proper relationships between categories, brands, and products in your system.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Egyptian HR Demo Data Overview */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Egyptian HR Demo Data Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Departments (11)
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Executive Office</strong> - Top management</li>
                <li>• <strong>Sales Department</strong> - Sales strategy</li>
                <li>• <strong>Marketing Department</strong> - Brand promotion</li>
                <li>• <strong>Technical Support</strong> - Product support</li>
                <li>• <strong>Finance Department</strong> - Financial management</li>
                <li>• <strong>Human Resources</strong> - Employee management</li>
                <li>• <strong>Operations</strong> - Warehouse & logistics</li>
                <li>• <strong>Retail Sales</strong> - Store operations</li>
                <li>• <strong>Corporate Sales</strong> - B2B sales</li>
                <li>• <strong>Digital Marketing</strong> - Online marketing</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Employees (15)
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>أحمد المحمدي</strong> - CEO (Executive Office)</li>
                <li>• <strong>مريم السعيد</strong> - Sales Director</li>
                <li>• <strong>يوسف العباسي</strong> - Marketing Manager</li>
                <li>• <strong>نورا الشريف</strong> - Technical Manager</li>
                <li>• <strong>خالد الفرعوني</strong> - CFO</li>
                <li>• <strong>رانيا المصري</strong> - HR Manager</li>
                <li>• <strong>محمد النوبي</strong> - Operations Manager</li>
                <li>• <strong>فاطمة القاهري</strong> - Retail Manager</li>
                <li>• <strong>أمير الاسكندراني</strong> - Corporate Sales Manager</li>
                <li>• <strong>دينا الحديثي</strong> - Digital Marketing Specialist</li>
                <li>• And 5 more staff members...</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Network className="h-4 w-4" />
                Organization Chart
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Hierarchical Structure</strong> - 3 levels deep</li>
                <li>• <strong>CEO at Top</strong> - Ahmed Mahmoudi</li>
                <li>• <strong>Department Managers</strong> - Direct reports</li>
                <li>• <strong>Team Leads & Staff</strong> - Operational level</li>
                <li>• <strong>Photography Equipment Company</strong> - Industry focus</li>
                <li>• <strong>Egyptian Names</strong> - Authentic local context</li>
                <li>• <strong>Complete Hierarchy</strong> - All relationships mapped</li>
                <li>• <strong>Department Structure</strong> - Parent-child relationships</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Egyptian HR Data Features</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• <strong>Authentic Egyptian Names</strong> - Realistic Arabic names with proper transliteration</li>
              <li>• <strong>Photography Equipment Focus</strong> - Tailored for camera and photography equipment sales</li>
              <li>• <strong>Complete Hierarchy</strong> - CEO → Directors → Managers → Staff structure</li>
              <li>• <strong>Department Relationships</strong> - Parent-child department structure with proper IDs</li>
              <li>• <strong>Egyptian Context</strong> - Addresses, phone numbers, and locations in Egypt</li>
              <li>• <strong>Comprehensive Data</strong> - Personal info, employment details, emergency contacts</li>
            </ul>
            <p className="text-xs text-green-700 mt-2">
              This creates a complete, realistic organizational structure for a photography equipment sales company in Egypt.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
