// frontend/lisan-admin/components/user-management/user-status-filter.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function UserStatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get('status') || 'all';

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== 'all') {
      params.set('status', value);
    } else {
      params.delete('status');
    }
    
    router.replace(`/users?${params.toString()}`);
  };

  return (
    <Select value={currentStatus} onValueChange={handleFilterChange}>
      <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
        <SelectValue placeholder="Filter by Status" />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 border-gray-700 text-white">
        <SelectItem value="all">All Statuses</SelectItem>
        <SelectItem value="ACTIVE">Active</SelectItem>
        <SelectItem value="BLOCKED">Blocked</SelectItem>
      </SelectContent>
    </Select>
  );
}