/**
 * คำอธิบาย:
 *   คอมโพเนนต์ FilterDate ใช้สำหรับแสดงช่องกรองข้อมูลของ Defect ตามช่วงวันที่
 * Input: 
 * - form: ข้อมูลของ Form ที่ใช้สำหรับกรองข้อมูล
 * Output:
 * - JSX ของ FilterDate ที่แสดงช่องกรองข้อมูลของ Defect ตามช่วงวันที่
 **/


import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DatePickerWithRange } from '@/components/date-picker';
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
    const { setValue, watch} = form;
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
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
