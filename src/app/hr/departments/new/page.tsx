'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { CreateDepartmentDTO } from '@/lib/models/department';
import DepartmentForm from '@/components/hr/DepartmentForm';

export default function AddDepartmentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const generateDepartmentId = () => {
    const existingCodes = ['DEP001', 'DEP002', 'DEP003', 'DEP004'];
    let newId = 1;
    while (existingCodes.includes(`DEP${newId.toString().padStart(3, '0')}`)) {
      newId++;
    }
    return `DEP${newId.toString().padStart(3, '0')}`;
  };

  const handleSubmit = async (formData: CreateDepartmentDTO) => {
    setLoading(true);

    try {
      const departmentData = {
        ...formData,
        departmentId: generateDepartmentId(),
        metrics: {
          totalEmployees: 0,
          averageSalary: 0,
          turnoverRate: 0,
          productivityScore: 0
        }
      };

      const response = await fetch('/api/hr/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(departmentData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Department created successfully!",
        });
        router.push('/hr/departments');
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to create department",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating department:', error);
      toast({
        title: "Error",
        description: "Failed to create department. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/hr/departments');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/hr/departments">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Departments
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add New Department</h1>
            <p className="text-muted-foreground">Create a new department in your organization</p>
          </div>
        </div>
      </div>

      <DepartmentForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        title="Add New Department"
        submitLabel="Create Department"
      />
    </div>
  );
}
