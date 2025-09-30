'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { validatePasswordStrength, PASSWORD_STRENGTH_LABELS, type PasswordStrength } from '@/lib/auth/password';
import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export function PasswordStrengthIndicator({ password, className }: PasswordStrengthIndicatorProps) {
  const validation = validatePasswordStrength(password);
  const strengthPercentage = (validation.score / 4) * 100;

  const getStrengthColor = (score: number) => {
    if (score === 0) return 'bg-red-500';
    if (score === 1) return 'bg-red-400';
    if (score === 2) return 'bg-yellow-400';
    if (score === 3) return 'bg-blue-400';
    return 'bg-green-500';
  };

  const getStrengthTextColor = (score: number) => {
    if (score === 0) return 'text-red-600';
    if (score === 1) return 'text-red-500';
    if (score === 2) return 'text-yellow-600';
    if (score === 3) return 'text-blue-600';
    return 'text-green-600';
  };

  if (!password) {
    return null;
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Password Strength</span>
        <Badge 
          variant="outline" 
          className={cn(
            'text-xs',
            getStrengthTextColor(validation.score)
          )}
        >
          {PASSWORD_STRENGTH_LABELS[validation.score as PasswordStrength]}
        </Badge>
      </div>
      
      <div className="relative">
        <Progress 
          value={strengthPercentage} 
          className="h-2"
        />
        <div 
          className={cn(
            "absolute top-0 left-0 h-2 rounded-full transition-all",
            getStrengthColor(validation.score)
          )}
          style={{ width: `${strengthPercentage}%` }}
        />
      </div>
      
      {validation.errors.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Requirements not met:</p>
          <ul className="text-xs text-red-600 space-y-0.5">
            {validation.errors.map((error, index) => (
              <li key={index} className="flex items-center gap-1">
                <span className="text-red-500">•</span>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {validation.isValid && (
        <p className="text-xs text-green-600 flex items-center gap-1">
          <span className="text-green-500">✓</span>
          Password meets all security requirements
        </p>
      )}
    </div>
  );
}
