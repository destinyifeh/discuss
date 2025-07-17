'use client';

import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';

import {Label} from '@/components/ui/label';
import {FC} from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Sections} from '@/constants/data';

type FilterProps = {
  filterSection: string;
  filterStatus: string;

  setFilterSection: (section: string) => void;
  setFilterStatus: (status: string) => void;
  setFilterDateRange: (date: string) => void;
  setFilterIsOpen: (filter: boolean) => void;
  filterDateRange: string;
};

export const AdminFilter: FC<FilterProps> = ({
  filterSection,
  filterStatus,

  setFilterSection,
  setFilterStatus,
  setFilterDateRange,
  filterDateRange,

  setFilterIsOpen,
}) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="filter-section">section</Label>
          <Select value={filterSection} onValueChange={setFilterSection}>
            <SelectTrigger id="filter-section">
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Sections.map(section => (
                <SelectItem key={section.id} value={section.id}>
                  {section.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="filter-status">Status</Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger id="filter-status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="filter-date">Date Range</Label>
          <Select value={filterDateRange} onValueChange={setFilterDateRange}>
            <SelectTrigger id="filter-date">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-3 flex justify-end">
          <Button
            variant="outline"
            className="mr-2"
            onClick={() => {
              setFilterSection('all');
              setFilterStatus('all');
              setFilterDateRange('all');
            }}>
            Reset Filters
          </Button>
          <Button
            onClick={() => setFilterIsOpen(false)}
            variant="outline"
            className="text-white bg-app-dark border-app-dark-border hover:text-black hover:bg-app-hover">
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
