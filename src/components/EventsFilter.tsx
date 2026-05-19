import { useState, useEffect } from 'react';
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
    onFilterChange: (filters: { start_date?: number; end_date?: number; sort_order?: 'asc' | 'desc' }) => void;
    onReset: () => void;
}

export const EventsFilter = (props: EventsFilterBarProps) => {
    const { start_date, end_date, sort_order, onFilterChange, onReset } = props;

    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs(start_date));
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs(end_date));

    // Keep internal local dayjs states synchronized if external values change (e.g., on Clear Filters)
    useEffect(() => {
        setStartDate(dayjs(start_date));
        setEndDate(dayjs(end_date));
    }, [start_date, end_date]);

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

                <FormControl size="small" className="sort-select-field">
                    <label className="datepicker-label">Sort By</label>
                    <Select
                        value={sort_order}
                        onChange={handleSortChange}
                    >
                        <MenuItem value="desc">Newest First</MenuItem>
                        <MenuItem value="asc">Oldest First</MenuItem>
                    </Select>
                </FormControl>
            </div>

            <div className="actions-group">
                {(start_date || end_date) && (
                    <Button
                        variant="outlined"
                        color="error" /* Changed from secondary to standard UI error/red for destructive actions if preferred, or keep secondary */
                        size="medium"
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