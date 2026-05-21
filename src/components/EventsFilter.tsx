import {useEffect, useState} from 'react';
import { MenuItem, Select, FormControl, Button, type SelectChangeEvent } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import './EventsFilter.css';
import {
    DatePicker,
    type DateValidationError,
    LocalizationProvider,
    type PickerChangeHandlerContext
} from "@mui/x-date-pickers";
import dayjs, { type Dayjs } from 'dayjs';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { PickerValue } from "@mui/x-date-pickers/internals";

interface EventsFilterBarProps {
    start_date: number;
    end_date: number;
    sort_order: 'asc' | 'desc';
    isPublic: boolean | undefined;
    isEventTypeFilterDisabled: boolean;
    onFilterChange: (filters: {
        start_date?: number;
        end_date?: number;
        sort_order?: 'asc' | 'desc';
        isPublic?: boolean | undefined;
    }) => void;
    onReset: () => void;
}

export const EventsFilter = (props: EventsFilterBarProps) => {
    const { start_date, end_date, sort_order, isPublic, isEventTypeFilterDisabled, onFilterChange, onReset } = props;

    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs(start_date));
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs(end_date));

    useEffect(() => {
        setStartDate(start_date ? dayjs(start_date) : null);
        setEndDate(end_date ? dayjs(end_date) : null);
    }, [end_date, start_date]);

    const handleStartDateChange = (value: PickerValue, _context: PickerChangeHandlerContext<DateValidationError>) => {
        if (value && dayjs(value).isValid()) {
            onFilterChange({ start_date: value.valueOf() });
        }
    };

    const handleEndDateChange = (value: PickerValue, _context: PickerChangeHandlerContext<DateValidationError>) => {
        if (value && dayjs(value).isValid()) {
            onFilterChange({ end_date: value.valueOf() });
        }
    };

    const handleSortChange = (e: SelectChangeEvent<'asc' | 'desc'>) => {
        onFilterChange({ sort_order: e.target.value as 'asc' | 'desc' });
    };

    const handleVisibilityChange = (e: SelectChangeEvent) => {
        const val = e.target.value;
        const isPublicValue = val === 'public' ? true : val === 'private' ? false : undefined;
        onFilterChange({ isPublic: isPublicValue });
    };

    const getVisibilityValue = () => {
        if (isPublic === true) return 'public';
        if (isPublic === false) return 'private';
        return 'all';
    };

    return (
        <div className="filter-bar-container">
            <div className="filter-group">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className="datepicker-control-wrapper">
                        <label className="datepicker-label">Start Date</label>
                        <DatePicker
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
                            onAccept={handleStartDateChange}
                            slotProps={{ textField: { size: 'small', className: 'filter-datepicker-field' } }}
                        />
                    </div>

                    <div className="datepicker-control-wrapper">
                        <label className="datepicker-label">End Date</label>
                        <DatePicker
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            onAccept={handleEndDateChange}
                            slotProps={{ textField: { size: 'small', className: 'filter-datepicker-field' } }}
                        />
                    </div>
                </LocalizationProvider>

                <div className="datepicker-control-wrapper">
                    <label className="datepicker-label">Event Type</label>
                    <FormControl size="small" className="sort-select-field">
                        <Select
                            value={getVisibilityValue()}
                            onChange={handleVisibilityChange}
                            disabled={isEventTypeFilterDisabled}
                        >
                            <MenuItem value="all">All Events</MenuItem>
                            <MenuItem value="public">Public</MenuItem>
                            <MenuItem value="private">Private</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <div className="datepicker-control-wrapper">
                    <label className="datepicker-label">Sort By</label>
                    <FormControl size="small" className="sort-select-field">
                        <Select
                            value={sort_order}
                            onChange={handleSortChange}
                            displayEmpty
                        >
                            <MenuItem value="desc">Latest</MenuItem>
                            <MenuItem value="asc">Oldest</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>

            <div className="actions-group">
                {(start_date || end_date || isPublic !== undefined) && (
                    <Button
                        variant="text"
                        color="error"
                        size="small"
                        startIcon={<ClearIcon />}
                        onClick={onReset}
                        className="reset-filter-btn"
                    >
                        Clear Filters
                    </Button>
                )}
            </div>
        </div>
    );
};