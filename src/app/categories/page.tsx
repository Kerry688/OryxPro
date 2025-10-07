'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Package,
  MoreHorizontal,
  Eye,
  Copy,
  Move,
  GripVertical,
  Filter,
  Download,
  Upload,
  Settings,
  Tag,
  Hash,
  Calendar,
  User,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ProductCategory } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export default function CategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.categories);
        // Auto-expand first level categories
        const firstLevelIds = data.categories
          .filter((cat: ProductCategory) => cat.level === 0)
          .map((cat: ProductCategory) => cat.id);
        setExpandedCategories(new Set(firstLevelIds));
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch categories",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Build tree structure from flat categories
  const categoryTree = useMemo(() => {
    const categoryMap = new Map<string, ProductCategory & { children: ProductCategory[] }>();
    const rootCategories: (ProductCategory & { children: ProductCategory[] })[] = [];

    // Initialize all categories with empty children arrays
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Build the tree structure
    categories.forEach(category => {
      const categoryWithChildren = categoryMap.get(category.id)!;
      
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children.push(categoryWithChildren);
        }
      } else {
        rootCategories.push(categoryWithChildren);
      }
    });

    // Sort categories by sortOrder
    const sortCategories = (cats: (ProductCategory & { children: ProductCategory[] })[]) => {
      cats.sort((a, b) => a.sortOrder - b.sortOrder);
      cats.forEach(cat => {
        if (cat.children.length > 0) {
          sortCategories(cat.children);
        }
      });
    };

    sortCategories(rootCategories);
    return rootCategories;
  }, [categories]);

  // Filter categories based on search term
  const filteredTree = useMemo(() => {
    if (!searchTerm) return categoryTree;

    const filterCategories = (cats: (ProductCategory & { children: ProductCategory[] })[]): (ProductCategory & { children: ProductCategory[] })[] => {
      return cats.filter(category => {
        const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             category.path.toLowerCase().includes(searchTerm.toLowerCase());
        
        const filteredChildren = filterCategories(category.children);
        
        if (matchesSearch || filteredChildren.length > 0) {
          return {
            ...category,
            children: filteredChildren
          };
        }
        
        return false;
      }).map(category => ({
        ...category,
        children: filterCategories(category.children)
      }));
    };

    return filterCategories(categoryTree);
  }, [categoryTree, searchTerm]);

  // Load categories on component mount
  React.useEffect(() => {
    fetchCategories();
  }, []);

  // Calculate statistics
  const totalCategories = categories.length;
  const rootCategories = categories.filter(c => c.level === 0).length;
  const subCategories = categories.filter(c => c.level > 0).length;
  const totalProducts = categories.reduce((sum, c) => sum + c.productCount, 0);

  // Helper functions
  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    const collectIds = (cats: (ProductCategory & { children: ProductCategory[] })[]) => {
      cats.forEach(cat => {
        allIds.add(cat.id);
        if (cat.children.length > 0) {
          collectIds(cat.children);
        }
      });
    };
    collectIds(categoryTree);
    setExpandedCategories(allIds);
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  const getCategoryIcon = (category: ProductCategory, hasChildren: boolean) => {
    if (hasChildren) {
      return expandedCategories.has(category.id) ? 
        <FolderOpen className="h-4 w-4 text-blue-500" /> : 
        <Folder className="h-4 w-4 text-blue-500" />;
    }
    return <Tag className="h-4 w-4 text-gray-500" />;
  };

  const getLevelIndent = (level: number) => {
    return level * 24; // 24px per level
  };

  // Tree View Component
  const CategoryTreeItem = ({ 
    category, 
    level = 0 
  }: { 
    category: ProductCategory & { children: ProductCategory[] }; 
    level?: number;
  }) => {
    const hasChildren = category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const indent = getLevelIndent(level);

    return (
      <div>
        <div 
          className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer group"
          style={{ paddingLeft: `${indent + 8}px` }}
          onClick={() => setSelectedCategory(category)}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(category.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
          
          {!hasChildren && <div className="w-6" />}
          
          <div className="flex items-center gap-2 flex-1">
            {getCategoryIcon(category, hasChildren)}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{category.name}</span>
                <Badge variant="outline" className="text-xs">
                  {category.productCount} products
                </Badge>
                {!category.isActive && (
                  <Badge variant="secondary" className="text-xs">
                    Inactive
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSelectedCategory(category)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setSelectedCategory(category);
                  setIsEditDialogOpen(true);
                }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Category
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Move className="mr-2 h-4 w-4" />
                  Move Category
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={async () => {
                    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
                      try {
                        const response = await fetch(`/api/categories/${category.id}`, {
                          method: 'DELETE',
                        });
                        const data = await response.json();
                        
                        if (data.success) {
                          toast({
                            title: "Success",
                            description: "Category deleted successfully",
                          });
                          fetchCategories();
                        } else {
                          toast({
                            title: "Error",
                            description: data.message || "Failed to delete category",
                            variant: "destructive",
                          });
                        }
                      } catch (error) {
                        console.error('Error deleting category:', error);
                        toast({
                          title: "Error",
                          description: "Failed to delete category",
                          variant: "destructive",
                        });
                      }
                    }
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Category
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {category.children.map((child) => (
              <CategoryTreeItem 
                key={child.id} 
                category={child} 
                level={level + 1} 
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // List View Component - Table Layout
  const CategoryTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Path</TableHead>
          <TableHead>Level</TableHead>
          <TableHead>Products</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Sort Order</TableHead>
          <TableHead className="w-[50px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id} className="hover:bg-gray-50">
            <TableCell>
              <div className="flex items-center gap-2">
                {getCategoryIcon(category, false)}
                <span className="font-medium">{category.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm text-muted-foreground">{category.path}</span>
            </TableCell>
            <TableCell>
              <Badge variant="outline">Level {category.level}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{category.productCount} products</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={category.isActive ? "default" : "secondary"}>
                {category.isActive ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>
              <span className="text-sm">{category.sortOrder}</span>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelectedCategory(category)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setSelectedCategory(category);
                    setIsEditDialogOpen(true);
                  }}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Category
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Move className="mr-2 h-4 w-4" />
                    Move Category
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={async () => {
                      if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
                        try {
                          const response = await fetch(`/api/categories/${category.id}`, {
                            method: 'DELETE',
                          });
                          const data = await response.json();
                          
                          if (data.success) {
                            toast({
                              title: "Success",
                              description: "Category deleted successfully",
                            });
                            fetchCategories();
                          } else {
                            toast({
                              title: "Error",
                              description: data.message || "Failed to delete category",
                              variant: "destructive",
                            });
                          }
                        } catch (error) {
                          console.error('Error deleting category:', error);
                          toast({
                            title: "Error",
                            description: "Failed to delete category",
                            variant: "destructive",
                          });
                        }
                      }
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Category
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Product Categories</h1>
          <p className="text-muted-foreground">Manage your product category hierarchy</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={expandAll}>
            <ChevronDown className="mr-2 h-4 w-4" />
            Expand All
          </Button>
          <Button variant="outline" onClick={collapseAll}>
            <ChevronRight className="mr-2 h-4 w-4" />
            Collapse All
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new product category
                </DialogDescription>
              </DialogHeader>
              <CategoryForm 
                category={null}
                categories={categories}
                onClose={() => setIsAddDialogOpen(false)}
                onSuccess={fetchCategories}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
            <p className="text-xs text-muted-foreground">
              {rootCategories} root, {subCategories} sub-categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max Depth</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.max(...categories.map(c => c.level))}
            </div>
            <p className="text-xs text-muted-foreground">
              Category levels
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {categories.filter(c => c.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'tree' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('tree')}
              >
                <Folder className="mr-2 h-4 w-4" />
                Tree View
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <Package className="mr-2 h-4 w-4" />
                List View
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Category Display */}
      <Card>
        <CardHeader>
          <CardTitle>
            {viewMode === 'tree' ? 'Category Tree' : 'Category List'} 
            ({viewMode === 'tree' ? filteredTree.length : categories.length})
          </CardTitle>
          <CardDescription>
            {viewMode === 'tree' 
              ? 'Hierarchical view of your product categories' 
              : 'Flat list of all categories'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading categories...</p>
            </div>
          ) : viewMode === 'tree' ? (
            <div className="space-y-1">
              {filteredTree.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No categories found</p>
                  <p className="text-sm">Try adjusting your search terms</p>
                </div>
              ) : (
                filteredTree.map((category) => (
                  <CategoryTreeItem key={category.id} category={category} />
                ))
              )}
            </div>
          ) : (
            <div>
              {categories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No categories found</p>
                </div>
              ) : (
                <CategoryTable />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? 'Edit Category' : 'Add Category'}
            </DialogTitle>
            <DialogDescription>
              {selectedCategory ? 'Update category information' : 'Create a new product category'}
            </DialogDescription>
          </DialogHeader>
          <CategoryForm 
            category={selectedCategory}
            categories={categories}
            onClose={() => {
              setIsEditDialogOpen(false);
              setSelectedCategory(null);
            }}
            onSuccess={fetchCategories}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Category Form Component
function CategoryForm({ 
  category, 
  categories,
  onClose,
  onSuccess
}: { 
  category: ProductCategory | null;
  categories: ProductCategory[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    slug: category?.slug || '',
    parentId: category?.parentId || '',
    isActive: category?.isActive ?? true,
    sortOrder: category?.sortOrder || 1,
  });

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Update slug when name changes
  const handleNameChange = (name: string) => {
    const newSlug = category?.slug || generateSlug(name);
    setFormData({ ...formData, name, slug: newSlug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.slug.trim()) {
      toast({
        title: "Error",
        description: "Category slug is required",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const url = category ? `/api/categories/${category.id}` : '/api/categories';
      const method = category ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: category ? "Category updated successfully" : "Category created successfully",
        });
        onClose();
        onSuccess(); // Refresh categories list
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to save category",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive",
      });
    }
  };

  // Get available parent categories (exclude current category and its descendants)
  const availableParents = categories.filter(c => 
    c.id !== category?.id && 
    c.level < 3 && // Max 3 levels deep
    c.isActive
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Category Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="auto-generated"
          />
        </div>
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
          <Label>Parent Category</Label>
          <Select value={formData.parentId} onValueChange={(value) => setFormData({ ...formData, parentId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select parent category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="root">Root Category</SelectItem>
              {availableParents.map(parent => (
                <SelectItem key={parent.id} value={parent.id}>
                  {parent.path}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Input
            id="sortOrder"
            type="number"
            value={formData.sortOrder}
            onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 1 })}
            min="1"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
        />
        <Label htmlFor="isActive">Active Category</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {category ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
}