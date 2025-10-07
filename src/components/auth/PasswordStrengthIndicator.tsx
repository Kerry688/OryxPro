'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export function PasswordStrengthIndicator({ password, className }: PasswordStrengthIndicatorProps) {
  const getPasswordStrength = (password: string) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    // Calculate score
    if (checks.length) score++;
    if (checks.lowercase) score++;
    if (checks.uppercase) score++;
    if (checks.number) score++;
    if (checks.special) score++;

    let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak';
    let color = 'bg-red-500';

    if (score >= 5) {
      strength = 'strong';
      color = 'bg-green-500';
    } else if (score >= 4) {
      strength = 'good';
      color = 'bg-blue-500';
    } else if (score >= 3) {
      strength = 'fair';
      color = 'bg-yellow-500';
    }

    return { strength, color, score, checks };
  };

  const { strength, color, score, checks } = getPasswordStrength(password);

  if (!password) {
    return null;
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Strength Bar */}
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={cn(
              'h-1 flex-1 rounded-full',
              level <= score ? color : 'bg-gray-200'
            )}
          />
        ))}
      </div>

      {/* Strength Text */}
      <div className="flex items-center justify-between text-xs">
        <span className={cn(
          'font-medium capitalize',
          strength === 'strong' && 'text-green-600',
          strength === 'good' && 'text-blue-600',
          strength === 'fair' && 'text-yellow-600',
          strength === 'weak' && 'text-red-600'
        )}>
          {strength} password
        </span>
        <span className="text-gray-500">
          {score}/5 requirements met
        </span>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1">
        {Object.entries(checks).map(([key, met]) => (
          <div key={key} className="flex items-center space-x-2 text-xs">
            <div className={cn(
              'w-3 h-3 rounded-full flex items-center justify-center',
              met ? 'bg-green-100' : 'bg-gray-100'
            )}>
              {met && (
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
              )}
            </div>
            <span className={cn(
              met ? 'text-green-700' : 'text-gray-500'
            )}>
              {key === 'length' && 'At least 8 characters'}
              {key === 'lowercase' && 'Contains lowercase letter'}
              {key === 'uppercase' && 'Contains uppercase letter'}
              {key === 'number' && 'Contains number'}
              {key === 'special' && 'Contains special character'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}