import React from 'react';
import { MenuItem, Select, FormControl, InputLabel, Button, type SelectChangeEvent } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import './EventsFilter.css';

interface EventsFilterBarProps {
    start_date: number;
    end_date: number;
    sort_order: 'asc' | 'desc';
    onFilterChange: (filters: { start_date?: number; end_date?: number; sort_order?: 'asc' | 'desc' }) => void;
    onReset: () => void;
}

export const EventsFilter = ({
                                    start_date,
                                    end_date,
                                    sort_order,
                                    onFilterChange,
                                    onReset
                                }: EventsFilterBarProps) => {

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange({ start_date: new Date(e.target.value).getTime() });
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange({ end_date: new Date(e.target.value).getTime() });
    };

    const handleSortChange = (e: SelectChangeEvent<'asc' | 'desc'>) => {
        onFilterChange({ sort_order: e.target.value as 'asc' | 'desc' });
    };

    return (
        <div className="filter-bar-container">
            <div className="filter-group">
                <div className="native-datepicker-wrapper">
                    <label className="datepicker-label">Start Date</label>
                    <input
                        type="date"
                        value={new Date(start_date).toISOString().split('T')[0]}
                        onChange={handleStartDateChange}
                        className="native-datepicker-input"
                    />
                </div>

                <div className="native-datepicker-wrapper">
                    <label className="datepicker-label">End Date</label>
                    <input
                        type="date"
                        value={new Date(end_date).toISOString().split('T')[0]}
                        onChange={handleEndDateChange}
                        className="native-datepicker-input"
                    />
                </div>

                <FormControl size="small" className="sort-select-field" sx={{ minWidth: 160 }}>
                    <InputLabel id="sort-order-label">Order By Date</InputLabel>
                    <Select
                        labelId="sort-order-label"
                        value={sort_order}
                        label="Order By Date"
                        onChange={handleSortChange}
                    >
                        <MenuItem value="desc">Newest First</MenuItem>
                        <MenuItem value="asc">Oldest First</MenuItem>
                    </Select>
                </FormControl>
            </div>

            {(start_date || end_date) && (
                <Button
                    variant="outlined"
                    color="secondary"
                    size="medium"
                    startIcon={<ClearIcon />}
                    onClick={onReset}
                    className="reset-filter-btn"
                >
                    Clear Filters
                </Button>
            )}
        </div>
    );
};