import React from 'react';
import { BlogDashboard } from '@/components/blog/BlogDashboard';
import { Navigation } from '@/components/ui/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const Admin = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16">
          <BlogDashboard />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Admin;
