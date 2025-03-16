/**
 * คำอธิบาย:
 *   คอมโพเนนต์ DatePicker ใช้สำหรับเลือกวันที่และเวลา โดยมี Dropdown ที่สามารถเลือกวันที่และเวลาได้
 * Input: 
 * - handleSelectedTime: ฟังก์ชันที่ใช้สำหรับเลือกวันที่และเวลาจาก Dropdown
 * Output:
 * - JSX ของ Dropdown ที่มีวันที่และเวลาที่สามารถเลือกได้
**/

"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DateRange } from "react-day-picker"
import { useTranslations } from "next-intl"

interface IDatePicker {
  handleSelectedTime: (time: string) => void;
}

export function DatePicker({
  handleSelectedTime,
}: IDatePicker) {
  const t = useTranslations("General");

  const [date, setDate] = React.useState<Date>()

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      // Format the selected date and time
      const formattedTime = format(selectedDate, "yyyy-MM-dd HH:mm:ss.SSS")
      handleSelectedTime(formattedTime)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'secondary'}
          className={cn(
            "w-[260px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{t('PickADate')}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

interface IDatePickerWithRange {
  startDate: Date | undefined; 
  endDate: Date | undefined; 
  onSelect: (date: DateRange) => void; 
  className?: string; 
}

export const DatePickerWithRange: React.FC<IDatePickerWithRange> = ({
  startDate,
  endDate,
  onSelect,
  className,
}) => {
  const [date, setDate] = React.useState<DateRange | undefined>(undefined); 
  const t = useTranslations("General");
  React.useEffect(() => {
    setDate({
      from: startDate,
      to: endDate,
    });
  }, [startDate, endDate]);

  const handleDateChange = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
    if (selectedDate?.from && selectedDate?.to) {
      onSelect(selectedDate);
    } else {
      // Handle the case where 'from' or 'to' is undefined
      onSelect({ from: selectedDate?.from || new Date(), to: selectedDate?.to || new Date() });
    }
  };
  
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"secondary"}
            className={cn(
              "w-[270px] justify-start text-left font-normal text-base",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>{t("PickADate")}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}