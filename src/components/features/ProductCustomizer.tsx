'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import type { Product, CustomizationOption, ImagePlaceholder } from '@/lib/data';
import { suggestDesignTools, SuggestDesignToolsOutput } from '@/ai/flows/ai-design-suggestions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { UploadCloud, Wand2, Info, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type ProductCustomizerProps = {
  product: Product;
  initialImage: ImagePlaceholder;
};

export function ProductCustomizer({ product, initialImage }: ProductCustomizerProps) {
  const { toast } = useToast();
  const [options, setOptions] = useState<Record<string, string | number>>({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialImage.imageUrl);

  const [jobDescription, setJobDescription] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState<SuggestDesignToolsOutput | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const defaultOptions: Record<string, string | number> = {};
    product.options.forEach((opt) => {
      defaultOptions[opt.id] = opt.defaultValue;
    });
    setOptions(defaultOptions);
  }, [product]);

  useEffect(() => {
    if (Object.keys(options).length === 0) return;

    let price = product.basePrice;
    let quantity = 1;

    for (const opt of product.options) {
      const selectedValue = options[opt.id];
      if (opt.type === 'select' && opt.choices) {
        const choice = opt.choices.find((c) => c.id === selectedValue);
        if (choice) {
          price += choice.priceModifier;
        }
      } else if (opt.type === 'quantity') {
        quantity = Number(selectedValue) || 1;
      }
    }

    setTotalPrice(price * quantity);
  }, [options, product]);

  const handleOptionChange = (optionId: string, value: string | number) => {
    setOptions((prev) => ({ ...prev, [optionId]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
        });
        return;
      }
      setDesignFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleGetAiSuggestion = async () => {
    if (!jobDescription) {
        toast({
            variant: "destructive",
            title: "Description empty",
            description: "Please describe your design needs first.",
        });
        return;
    }
    setIsAiLoading(true);
    setAiSuggestion(null);
    try {
        const result = await suggestDesignTools({ jobDescription });
        setAiSuggestion(result);
    } catch (error) {
        console.error("AI suggestion failed:", error);
        toast({
            variant: "destructive",
            title: "AI Suggestion Failed",
            description: "Could not get an AI suggestion at this time. Please try again later.",
        });
    } finally {
        setIsAiLoading(false);
    }
  };

  const quantityOption = useMemo(() => product.options.find(opt => opt.type === 'quantity'), [product.options]);

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl md:text-4xl font-headline font-bold">{product.name}</h1>
            <p className="text-muted-foreground">{product.longDescription}</p>
            <div className="aspect-[4/3] w-full relative bg-muted rounded-lg overflow-hidden border">
                <Image
                src={previewUrl}
                alt={designFile ? "Your design preview" : product.name}
                fill
                className="object-contain"
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="design-upload" className={cn("text-base font-semibold", designFile && "text-green-600")}>
                    {designFile ? `${designFile.name} Uploaded!` : 'Upload Your Design'}
                </Label>
                <div className="relative">
                    <Input id="design-upload" type="file" className="w-full h-full absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} accept="image/*,.pdf,.ai,.psd" />
                    <Button variant="outline" asChild className="pointer-events-none w-full">
                        <div>
                            <UploadCloud className="mr-2 h-4 w-4" />
                            {designFile ? 'Change file' : 'Choose a file'}
                        </div>
    
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">PNG, JPG, PDF, AI, PSD. Max 10MB.</p>
            </div>
        </div>

      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Customize Your Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {product.options.map((opt) => (
                <div key={opt.id} className="grid gap-2">
                  <Label htmlFor={opt.id} className="font-semibold">{opt.name}</Label>
                  {opt.type === 'select' ? (
                    <Select
                      value={options[opt.id]?.toString()}
                      onValueChange={(value) => handleOptionChange(opt.id, value)}
                    >
                      <SelectTrigger id={opt.id}>
                        <SelectValue placeholder={`Select ${opt.name}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {opt.choices?.map((choice) => (
                          <SelectItem key={choice.id} value={choice.id}>
                            {choice.name}
                            {choice.priceModifier > 0 && ` (+${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(choice.priceModifier)})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={opt.id}
                      type="number"
                      value={options[opt.id]}
                      onChange={(e) => handleOptionChange(opt.id, parseInt(e.target.value, 10))}
                      min="1"
                    />
                  )}
                </div>
              ))}
            </div>

            <Separator />
            
            <Card className="bg-secondary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-headline">
                  <Wand2 className="text-accent" />
                  AI Design Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label htmlFor="ai-description">Describe what you need designed</Label>
                <Textarea
                  id="ai-description"
                  placeholder={`e.g., "A modern, minimalist business card for a software engineer."`}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <Button onClick={handleGetAiSuggestion} disabled={isAiLoading} className="w-full">
                  {isAiLoading ? <Loader2 className="animate-spin mr-2" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  Get AI Suggestions
                </Button>
                {aiSuggestion && aiSuggestion.shouldShowDesignToolSuggestion && (
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>AI Suggestion</AlertTitle>
                        <AlertDescription>{aiSuggestion.suggestedToolDescription}</AlertDescription>
                    </Alert>
                )}
                {aiSuggestion && !aiSuggestion.shouldShowDesignToolSuggestion && (
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>All Set!</AlertTitle>
                        <AlertDescription>Your description is clear. You can proceed with your design upload.</AlertDescription>
                    </Aler>
                )}
              </CardContent>
            </Card>

            <Separator />

            <div className="space-y-4">
              <div className="flex justify-between items-center text-2xl font-bold">
                <span className="font-headline">Total Price</span>
                <span>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalPrice)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Price for {options[quantityOption?.id || 'quantity'] || 0} units. Taxes and shipping calculated at checkout.
              </p>
              <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg">
                Proceed to Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
