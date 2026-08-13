import React from 'react';
import { Link } from 'react-router-dom';
import { CompassIcon } from 'lucide-react';
import { Card } from '../../components/admin/ui/Card';
import { Button } from '../../components/admin/ui/Button';
import { EmptyState } from '../../components/admin/ui/EmptyState';

export function NotFound() {
  return (
    <Card>
      <EmptyState
        icon={CompassIcon}
        title="Page not found"
        message="This module does not exist in the admin console. Use the sidebar or global search to find what you need."
        action={
        <Link to="/">
            <Button variant="primary" size="sm">
              Back to dashboard
            </Button>
          </Link>
        } />
      
    </Card>);

}