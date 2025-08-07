import React from 'react';
import { BlogDashboard } from '@/components/blog/BlogDashboard';
import { Navigation } from '@/components/ui/navigation';

const Admin = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <BlogDashboard />
      </div>
    </div>
  );
};

export default Admin;
