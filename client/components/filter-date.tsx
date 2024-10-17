import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DatePickerWithRange } from '../components/date-picker';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

const FilterDate = ({
    form,
}: {
    form: UseFormReturn<{
        status?: string | undefined;
        daterange?: { from: Date; to: Date } | Date | undefined;
    }, any, undefined>;
}) => {
    const { setValue, watch, resetField } = form;
    const watchDaterange = watch('daterange') as { from: Date | null; to: Date | null } | undefined;

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    useEffect(() => {
        if (watchDaterange) {
            setStartDate(watchDaterange.from ?? null);
            setEndDate(watchDaterange.to ?? null);
        }
    }, [watchDaterange]);

    const handleDateSelect = (selectedDate: Date | { from: Date; to: Date }) => {
        if (selectedDate instanceof Date) {
            setValue('daterange', { from: selectedDate, to: selectedDate });
        } else {
            setValue('daterange', selectedDate);
        }
    };

    useEffect(() => {
        const subscription = form.watch((value) => {
            if (!value.daterange) {
                setStartDate(null);
                setEndDate(null);
            }
        });
        return () => subscription.unsubscribe();
    }, [form]);

    return (
        <div>
            <div className='mt-2'>
                <FormField
                    control={form.control}
                    name="daterange"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date Range</FormLabel>
                            <FormControl>
                                <DatePickerWithRange
                                    startDate={startDate}
                                    endDate={endDate}
                                    onSelect={handleDateSelect}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
};

export default FilterDate;
