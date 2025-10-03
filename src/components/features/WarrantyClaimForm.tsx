'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  WarrantyClaim, 
  CreateWarrantyClaimData, 
  ClaimStatus,
  ClaimType,
  WarrantyCard 
} from '@/lib/models/warranty-client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { 
  AlertTriangle, 
  FileText, 
  Upload, 
  X,
  Camera,
  File,
  Video
} from 'lucide-react';

const claimFormSchema = z.object({
  warrantyCardId: z.string().min(1, 'Warranty card is required'),
  customerId: z.string().min(1, 'Customer is required'),
  issueDescription: z.string().min(10, 'Issue description must be at least 10 characters'),
  claimType: z.enum(['defect', 'malfunction', 'damage', 'performance', 'other']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  severity: z.enum(['minor', 'moderate', 'major', 'critical']),
  evidence: z.object({
    photos: z.array(z.string()),
    documents: z.array(z.string()),
    videos: z.array(z.string()).optional()
  })
});

type ClaimFormData = z.infer<typeof claimFormSchema>;

interface WarrantyClaimFormProps {
  claim?: WarrantyClaim;
  warrantyCard?: WarrantyCard;
  onSave: (data: CreateWarrantyClaimData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function WarrantyClaimForm({ 
  claim, 
  warrantyCard,
  onSave, 
  onCancel, 
  isLoading = false 
}: WarrantyClaimFormProps) {
  const { user } = useAuth();
  const [warrantyCards, setWarrantyCards] = useState<WarrantyCard[]>([]);
  const [selectedWarranty, setSelectedWarranty] = useState<WarrantyCard | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [documents, setDocuments] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [newPhoto, setNewPhoto] = useState('');
  const [newDocument, setNewDocument] = useState('');
  const [newVideo, setNewVideo] = useState('');

  const form = useForm<ClaimFormData>({
    resolver: zodResolver(claimFormSchema),
    defaultValues: {
      warrantyCardId: claim?.warrantyCardId?.toString() || warrantyCard?._id?.toString() || '',
      customerId: claim?.customerId?.toString() || warrantyCard?.customerId?.toString() || '',
      issueDescription: claim?.issueDescription || '',
      claimType: claim?.claimType || 'defect',
      priority: claim?.priority || 'medium',
      severity: claim?.severity || 'moderate',
      evidence: {
        photos: claim?.evidence?.photos || [],
        documents: claim?.evidence?.documents || [],
        videos: claim?.evidence?.videos || []
      }
    }
  });

  // Load warranty cards on component mount
  useEffect(() => {
    loadWarrantyCards();
  }, []);

  // Set evidence arrays from form data
  useEffect(() => {
    const evidence = form.getValues('evidence');
    setPhotos(evidence.photos || []);
    setDocuments(evidence.documents || []);
    setVideos(evidence.videos || []);
  }, [form]);

  // Update selected warranty when warrantyCardId changes
  useEffect(() => {
    const warrantyCardId = form.getValues('warrantyCardId');
    if (warrantyCardId) {
      const warranty = warrantyCards.find(w => w._id?.toString() === warrantyCardId);
      setSelectedWarranty(warranty || null);
    }
  }, [form.watch('warrantyCardId'), warrantyCards]);

  const loadWarrantyCards = async () => {
    try {
      const response = await fetch('/api/warranties');
      const data = await response.json();
      if (data.success) {
        setWarrantyCards(data.data);
      }
    } catch (error) {
      console.error('Error loading warranty cards:', error);
    }
  };

  const addPhoto = () => {
    if (newPhoto.trim()) {
      const updated = [...photos, newPhoto.trim()];
      setPhotos(updated);
      form.setValue('evidence.photos', updated);
      setNewPhoto('');
    }
  };

  const removePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    setPhotos(updated);
    form.setValue('evidence.photos', updated);
  };

  const addDocument = () => {
    if (newDocument.trim()) {
      const updated = [...documents, newDocument.trim()];
      setDocuments(updated);
      form.setValue('evidence.documents', updated);
      setNewDocument('');
    }
  };

  const removeDocument = (index: number) => {
    const updated = documents.filter((_, i) => i !== index);
    setDocuments(updated);
    form.setValue('evidence.documents', updated);
  };

  const addVideo = () => {
    if (newVideo.trim()) {
      const updated = [...videos, newVideo.trim()];
      setVideos(updated);
      form.setValue('evidence.videos', updated);
      setNewVideo('');
    }
  };

  const removeVideo = (index: number) => {
    const updated = videos.filter((_, i) => i !== index);
    setVideos(updated);
    form.setValue('evidence.videos', updated);
  };

  const onSubmit = (data: ClaimFormData) => {
    if (!user?._id) {
      toast({
        title: 'Error',
        description: 'User not authenticated',
        variant: 'destructive'
      });
      return;
    }

    const claimData: CreateWarrantyClaimData = {
      warrantyCardId: new ObjectId(data.warrantyCardId),
      customerId: new ObjectId(data.customerId),
      issueDescription: data.issueDescription,
      claimType: data.claimType,
      priority: data.priority,
      severity: data.severity,
      evidence: {
        photos: data.evidence.photos,
        documents: data.evidence.documents,
        videos: data.evidence.videos
      },
      createdBy: new ObjectId(user._id)
    };

    onSave(claimData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {claim ? 'Edit Warranty Claim' : 'Create Warranty Claim'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Warranty Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Warranty Information</h3>
                
                <FormField
                  control={form.control}
                  name="warrantyCardId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warranty Card *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select warranty card" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {warrantyCards.map((warranty) => (
                            <SelectItem key={warranty._id?.toString()} value={warranty._id?.toString() || ''}>
                              {warranty.warrantyNumber} - {warranty.productName} ({warranty.customerName})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedWarranty && (
                  <div className="p-4 bg-gray-50 rounded-md">
                    <h4 className="font-medium mb-2">Warranty Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Warranty Number:</span>
                        <p>{selectedWarranty.warrantyNumber}</p>
                      </div>
                      <div>
                        <span className="font-medium">Product:</span>
                        <p>{selectedWarranty.productName}</p>
                      </div>
                      <div>
                        <span className="font-medium">Customer:</span>
                        <p>{selectedWarranty.customerName}</p>
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>
                        <Badge variant={selectedWarranty.status === 'active' ? 'default' : 'secondary'}>
                          {selectedWarranty.status}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">Start Date:</span>
                        <p>{new Date(selectedWarranty.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="font-medium">End Date:</span>
                        <p>{new Date(selectedWarranty.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Claim Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Claim Details</h3>
                
                <FormField
                  control={form.control}
                  name="issueDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Describe the issue in detail..." 
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="claimType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Claim Type *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select claim type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="defect">Defect</SelectItem>
                            <SelectItem value="malfunction">Malfunction</SelectItem>
                            <SelectItem value="damage">Damage</SelectItem>
                            <SelectItem value="performance">Performance</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="severity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Severity *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="minor">Minor</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="major">Major</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Evidence */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Evidence</h3>
                
                {/* Photos */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Photos
                  </Label>
                  <div className="space-y-2">
                    {photos.map((photo, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="secondary">{photo}</Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePhoto(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={newPhoto}
                        onChange={(e) => setNewPhoto(e.target.value)}
                        placeholder="Add photo URL"
                      />
                      <Button type="button" onClick={addPhoto} size="sm">
                        Add Photo
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <File className="h-4 w-4" />
                    Documents
                  </Label>
                  <div className="space-y-2">
                    {documents.map((document, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline">{document}</Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={newDocument}
                        onChange={(e) => setNewDocument(e.target.value)}
                        placeholder="Add document URL"
                      />
                      <Button type="button" onClick={addDocument} size="sm">
                        Add Document
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Videos */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Videos
                  </Label>
                  <div className="space-y-2">
                    {videos.map((video, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="destructive">{video}</Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVideo(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={newVideo}
                        onChange={(e) => setNewVideo(e.target.value)}
                        placeholder="Add video URL"
                      />
                      <Button type="button" onClick={addVideo} size="sm">
                        Add Video
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : claim ? 'Update Claim' : 'Create Claim'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
