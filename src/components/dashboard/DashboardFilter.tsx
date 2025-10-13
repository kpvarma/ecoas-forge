import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface DashboardFilterProps {
  onFilterChange: (filters: any) => void;
}

export const DashboardFilter: React.FC<DashboardFilterProps> = ({ onFilterChange }) => {
  const [partId, setPartId] = React.useState('');
  const [plantId, setPlantId] = React.useState('');
  const [owner, setOwner] = React.useState<string | undefined>(undefined);
  const [approvalStatus, setApprovalStatus] = React.useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);

  const handleApplyFilters = () => {
    onFilterChange({
      partId,
      plantId,
      owner,
      approvalStatus,
      receivedOnFrom: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
      receivedOnTo: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
    });
  };

  const handleClearFilters = () => {
    setPartId('');
    setPlantId('');
    setOwner(undefined);
    setApprovalStatus(undefined);
    setDateRange(undefined);
    onFilterChange({}); // Clear all filters
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 border-b">
      <SearchableSelect
        options={[
          { value: 'part1', label: 'Part 1' },
          { value: 'part2', label: 'Part 2' },
          { value: 'part3', label: 'Part 3' },
        ]}
        value={partId}
        onValueChange={setPartId}
        placeholder="Select Part ID"
        className="w-[180px]"
      />
      <SearchableSelect
        options={[
          { value: 'plantA', label: 'Plant A' },
          { value: 'plantB', label: 'Plant B' },
          { value: 'plantC', label: 'Plant C' },
        ]}
        value={plantId}
        onValueChange={setPlantId}
        placeholder="Select Plant ID"
        className="w-[180px]"
      />
      <SearchableSelect
        options={[
          { value: 'Jane Smith', label: 'Jane Smith' },
          { value: 'Mike Johnson', label: 'Mike Johnson' },
          { value: 'Sarah Davis', label: 'Sarah Davis' },
          { value: 'Tom Wilson', label: 'Tom Wilson' },
          { value: 'Unassigned', label: 'Unassigned' },
        ]}
        value={owner}
        onValueChange={setOwner}
        placeholder="Select Owner"
        className="w-[180px]"
      />
      <Select value={approvalStatus} onValueChange={setApprovalStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Approval Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
          {/* Add more statuses dynamically */}
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-[280px] justify-start text-left font-normal',
              !dateRange?.from && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                </>
              ) : (
                format(dateRange.from, 'LLL dd, y')
              )
            ) : (
              <span>Received On Date Range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <Button onClick={handleApplyFilters}>Apply Filters</Button>
      <Button variant="outline" onClick={handleClearFilters}>Clear Filters</Button>
    </div>
  );
};