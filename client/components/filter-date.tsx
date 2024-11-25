import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DatePickerWithRange } from '../components/date-picker';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { DateRange } from 'react-day-picker';

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

    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    useEffect(() => {
        if (watchDaterange) {
            setStartDate(watchDaterange.from ?? undefined);
            setEndDate(watchDaterange.to ?? undefined);
        }
    }, [watchDaterange]);

    // const handleDateSelect = (selectedDate: Date | { from: Date; to: Date }) => {
    //     if (selectedDate instanceof Date) {
    //         setValue('daterange', { from: selectedDate, to: selectedDate });
    //     } else {
    //         setValue('daterange', selectedDate);
    //     }
    // };
    const handleDateSelect = (selectedDate: DateRange | undefined) => {
        if (selectedDate?.from && selectedDate?.to) {
            setValue('daterange', {
                from: selectedDate.from,
                to: selectedDate.to,
            });
        } else {
            // Handle partial selection or reset
            setValue('daterange', {
                from: selectedDate?.from || new Date(), // Optional: Add default or handle differently
                to: selectedDate?.to || new Date(),
            });
        }
    };
    
    useEffect(() => {
        const subscription = form.watch((value) => {
            if (!value.daterange) {
                setStartDate(undefined);
                setEndDate(undefined);
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
