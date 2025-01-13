'use client'
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

interface TimerProps {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
}

const getTimeElapsed = (startTime: number): TimerProps => {
    const difference = new Date().getTime() - startTime;

    if (difference <= 0) {
        return { days: "00", hours: "00", minutes: "00", seconds: "00" };
    }

    const days = String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0');
    const hours = String(Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const seconds = String(Math.floor((difference % (1000 * 60)) / 1000)).padStart(2, '0');

    return { days, hours, minutes, seconds };
};

const formatDuration = (duration: string): TimerProps => {
    const match = duration.match(/(?:(\d+)d\s*)?(?:(\d+)h\s*)?(?:(\d+)m\s*)?(?:(\d+)s)?/);

    const days = match?.[1] ? match[1].padStart(2, '0') : "00";
    const hours = match?.[2] ? match[2].padStart(2, '0') : "00";
    const minutes = match?.[3] ? match[3].padStart(2, '0') : "00";
    const seconds = match?.[4] ? match[4].padStart(2, '0') : "00";

    return { days, hours, minutes, seconds };
};

const PatrolTimer = ({ launchDate, patrolStatus, patrolDuration }: { launchDate: string, patrolStatus: string, patrolDuration: string }) => {
    const [timeElapsed, setTimeElapsed] = useState<TimerProps>({ days: "00", hours: "00", minutes: "00", seconds: "00" });
    const [startTime, setStartTime] = useState<number>(new Date(launchDate).getTime());
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
        setStartTime(new Date(launchDate).getTime());

        if (patrolStatus === "completed") {
            setTimeElapsed(formatDuration(patrolDuration));
            return; // หยุดที่นี่เมื่อ patrolStatus เป็น completed
        }

        if (patrolStatus === "on_going") {
            setTimeElapsed(getTimeElapsed(new Date(launchDate).getTime()));

            const interval = setInterval(() => {
                setTimeElapsed(getTimeElapsed(new Date(launchDate).getTime()));
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [patrolStatus, launchDate, patrolDuration]);

    if (!mounted) {
        return <Skeleton />;
    }

    return (
        <div className='flex flex-row items-center text-2xl font-semibold gap-2'>
            {patrolStatus === "on_going" ? (
                <>
                    <span className="material-symbols-outlined text-card-foreground w-[22px] h-[22px]">
                        timer
                    </span>
                    {timeElapsed.days !== "00" && <p>{timeElapsed.days} Days</p>}
                    {(timeElapsed.hours !== "00" || timeElapsed.days !== "00") && <p>{timeElapsed.hours} Hours</p>}
                    <p>{timeElapsed.minutes} Minutes</p>
                    <p>{timeElapsed.seconds} Seconds</p>
                </>
            ) : patrolStatus === "completed" && patrolDuration ? (
                <>
                    <span className="material-symbols-outlined text-card-foreground w-[22px] h-[22px]">
                        timer
                    </span>
                    {formatDuration(patrolDuration).days !== "00" && <p>{formatDuration(patrolDuration).days} Days</p>}
                    {(formatDuration(patrolDuration).hours !== "00" || formatDuration(patrolDuration).days !== "00") && <p>{formatDuration(patrolDuration).hours} Hours</p>}
                    <p>{formatDuration(patrolDuration).minutes} Minutes</p>
                    <p>{formatDuration(patrolDuration).seconds} Seconds</p>
                </>
            ) : null}
        </div>
    );
};

export default PatrolTimer;
