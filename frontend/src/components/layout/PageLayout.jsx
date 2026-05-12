import React from 'react';
import Navbar from '../navbar/Navbar';

export function PageLayout({ children, title, description }) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 px-4 pb-4 pt-28 md:px-8 md:pb-8 md:pt-32 font-sans">
        <div className="max-w-7xl mx-auto space-y-8">
          {title && (
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">{title}</h1>
              {description && <p className="text-muted-foreground mt-2 font-medium">{description}</p>}
            </div>
          )}
          {children}
        </div>
      </div>
    </>
  );
}
