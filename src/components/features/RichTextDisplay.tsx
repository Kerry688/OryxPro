'use client';

import React from 'react';

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

export function RichTextDisplay({ content, className = '' }: RichTextDisplayProps) {
  // Function to convert HTML to safe JSX
  const createMarkup = (htmlContent: string) => {
    return { __html: htmlContent };
  };

  // Basic sanitization (in production, use a proper HTML sanitizer like DOMPurify)
  const sanitizeHtml = (html: string) => {
    // Remove potentially dangerous tags and attributes
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '');
  };

  if (!content) {
    return <p className={`text-gray-500 italic ${className}`}>No description provided</p>;
  }

  return (
    <div 
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={createMarkup(sanitizeHtml(content))}
      style={{
        // Custom styles for rich text content
        lineHeight: '1.6',
      }}
    />
  );
}
