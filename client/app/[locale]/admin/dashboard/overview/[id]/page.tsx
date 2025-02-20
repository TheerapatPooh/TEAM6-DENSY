'use client'

import { IDefect, IDefectCategory, IPatrol, IPatrolResult, IUser } from '@/app/type'
import BadgeCustom from '@/components/badge-custom'
import defect from '@/components/defect'
import Loading from '@/components/loading'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { exportData, fetchData, formatTime, getDefectStatusVariant, getInitials, getItemTypeVariant, getPatrolStatusVariant } from '@/lib/utils'
import { useLocale, useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import Map from "@/components/map";
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DonutGraph } from '@/components/donut-graph'
import { RadialChart } from '@/components/radial-chart'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { CardFooter } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import NotFound from '@/components/not-found'

export default function page() {
    const a = useTranslations("Alert");
    const z = useTranslations("Zone");
    const t = useTranslations("General");
    const s = useTranslations("Status");
    const d = useTranslations("Dashboard");

    const [patrol, setPatrol] = useState<IPatrol>(null);
    const params = useParams();
    const [mounted, setMounted] = useState(false);
    const [defects, setDefects] = useState<IDefect[]>([])
    const [defectCategory, setDefectCategory] = useState<IDefectCategory>();
    const router = useRouter();
    const locale = useLocale();

    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [hoverState, setHoverState] = useState<{ [key: string]: { isHovered: boolean; isClicked: boolean } }>({});


    const getPatrolData = async () => {
        if (params.id) {
            try {
                const data = await fetchData("get", `/patrol/${params.id}?preset=true&result=true`, true);
                setPatrol(data);
            } catch (error) {
                console.error("Failed to fetch patrol data:", error);
            }
        }
    };

    const getDefectReported = async () => {
        if (params.id) {
            try {
                const data = await fetchData("get", `/dashboard/overview/${params.id}`, true);
                setDefects(data);
            } catch (error) {
                console.error("Failed to fetch defect data:", error);
            }
        }
    };

    const getDefectCategory = async () => {
        if (params.id) {
            try {
                const data = await fetchData("get", `/dashboard/defect-category?patrolId=${params.id}`, true);
                setDefectCategory(data);
            } catch (error) {
                console.error("Failed to fetch defect data:", error);
            }
        }
    };
    const inspectors = patrol?.patrolChecklists
        .map(checklist => checklist.inspector) // ดึง inspector ออกจาก patrolChecklists
        .filter((inspector, index, self) =>
            self.findIndex(i => i.id === inspector.id) === index // กรอง inspector ที่ซ้ำกันออก
        );

    const handleOpenDialog = () => {
        setIsAlertOpen(true);
    };

    const handleCloseDialog = () => {
        setIsAlertOpen(false)
    }

    const formatId = (id: number): string => {
        return `P${id.toString().padStart(4, '0')}`;
    };

    const countPatrolResult = (results: IPatrolResult[]) => {
        let total = 0;
        let pass = 0;
        let fail = 0;
        let defect = 0;
        let comment = 0;

        results?.forEach((result) => {
            if (result.status === false) {
                fail++;
            }

            if (result.status === true) {
                pass++;
            }

            if (Array.isArray(result.defects) && result.defects.length > 0) {
                defect++;
            }

            if (Array.isArray(result.comments) && result.comments.length > 0) {
                comment++;
            }

            total++;
        });

        return { total, pass, fail, defect, comment };
    };

    function getZoneAllDefects(): number[] {
        const zoneIds = new Set<number>();

        defects.forEach((item) => {
            if (item.zone && item.zone.id) {
                zoneIds.add(item.zone.id);
            }
        });

        return Array.from(zoneIds);
    }

    const handleMouseEnter = (id: string) => {
        setHoverState((prev) => ({
            ...prev,
            [id]: { ...prev[id], isHovered: true },
        }));
    };

    const handleMouseLeave = (id: string) => {
        setHoverState((prev) => ({
            ...prev,
            [id]: { ...prev[id], isHovered: false },
        }));
    };

    const handleClick = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setHoverState((prev) => ({
            ...prev,
            [id]: { ...prev[id], isClicked: !prev[id]?.isClicked },
        }));
    };

    useEffect(() => {
        // ฟังก์ชันที่ใช้เพื่ออัพเดตความกว้างหน้าจอ
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        // เพิ่ม event listener สำหรับ resize
        window.addEventListener('resize', handleResize);

        // ลบ event listener เมื่อคอมโพเนนต์ถูกทำลาย
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);



    useEffect(() => {
        const fetchData = async () => {
            try {
                await getPatrolData();
                await getDefectReported();
                await getDefectCategory();
            } catch (error) {
                console.error("Error loading data: ", error);
            } finally {
                setMounted(true);
            }
        };
        fetchData();
    }, []);

    if (!mounted) {
        return <Loading />;
    }

    return (
        <div className='flex flex-col gap-4'>
            {/* //first block */}
            <div className='flex flex-col gap-4 bg-card px-6 py-4 rounded-md' >
                <div className='flex flex-row justify-between  rounded-md'>
                    <p className='text-muted-foreground text-lg font-semibold text-'>{formatTime(patrol.date, locale, false)}</p>
                    <div className='flex flex-row gap-2'>
                        <Button size='lg' variant='secondary' className='flex flex-row items-center' onClick={() => router.push(`/${locale}/admin/dashboard/overview/`)}>
                            <p>{t("Back")}</p>
                        </Button>

                        <AlertDialog open={isAlertOpen}>
                            <AlertDialogTrigger asChild>
                                <Button size='lg' variant='primary' className='flex flex-row items-center'
                                    onClick={() => handleOpenDialog()}
                                >
                                    <span className="material-symbols-outlined text-card w-[22px] h-[22px]">
                                        ios_share
                                    </span>
                                    <p>{t("Export")}</p>
                                </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent className="w-[400px] h-fit px-6 py-4 ">
                                <AlertDialogHeader className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-lg font-semibold text-muted-foreground">
                                            {formatTime(patrol.date, locale, false)}
                                        </p>
                                        <AlertDialogTitle>
                                            <p className="text-2xl font-semibold">
                                                {patrol.preset.title}
                                            </p>
                                        </AlertDialogTitle>
                                    </div>

                                    <AlertDialogDescription className="flex flex-col gap-2">
                                        <div className="flex flex-row gap-1">
                                            <span className="material-symbols-outlined">
                                                description
                                            </span>
                                            <p className="text-muted-foreground text-xl font-semibold">
                                                {formatId(patrol.id)}
                                            </p>
                                        </div>

                                        <div>
                                            <HoverCard open={hoverState['export']?.isClicked || hoverState['export']?.isHovered}>
                                                <HoverCardTrigger
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleClick('export', e)
                                                    }}
                                                    onMouseEnter={() => handleMouseEnter('export')}
                                                    onMouseLeave={() => handleMouseLeave('export')}
                                                    asChild
                                                >
                                                    <div className="flex text-muted-foreground items-center">
                                                        <span className="material-symbols-outlined me-1">
                                                            person_search
                                                        </span>
                                                        {inspectors.length > 0 && (
                                                            <div className="flex items-center me-1 truncate max-w-[190px]">
                                                                <p className="text-xl me-2.5 truncate">
                                                                    {inspectors[0].profile.name}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {inspectors.map((inspector, idx) => {
                                                            return (
                                                                <Avatar
                                                                    key={idx}
                                                                    className="custom-shadow ms-[-10px]"
                                                                >
                                                                    <AvatarImage
                                                                        src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${inspector?.profile?.image?.path}`}
                                                                    />
                                                                    <AvatarFallback
                                                                        id={inspector.id.toString()}
                                                                    >
                                                                        {getInitials(inspector.profile.name)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            );
                                                        })}

                                                        {inspectors.length > 5 && (
                                                            <Avatar className="custom-shadow flex items-center justify-center ms-[-10px]">
                                                                <AvatarImage src="" />
                                                                <span className="absolute text-card-foreground text-[16px] font-semibold">
                                                                    +{inspectors.length - 5}
                                                                </span>
                                                                <AvatarFallback id={"0"}></AvatarFallback>
                                                            </Avatar>
                                                        )}
                                                    </div>
                                                </HoverCardTrigger>
                                                <HoverCardContent side="bottom" align="start"
                                                    className="flex flex-col w-fit border-none gap-4 px-6 py-4 custom-shadow">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <span className="material-symbols-outlined">
                                                            person_search
                                                        </span>
                                                        <p className="text-lg font-semibold">
                                                            {t("InspectorList")}
                                                        </p>
                                                    </div>
                                                    {inspectors.map((inspector, idx) => {
                                                        return (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center w-full py-2 gap-1 border-b-2 border-secondary"
                                                            >
                                                                <Avatar className="custom-shadow ms-[-10px] me-2.5">
                                                                    <AvatarImage
                                                                        src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${inspector.profile.image?.path}`}
                                                                    />
                                                                    <AvatarFallback
                                                                        id={inspector.id.toString()}
                                                                    >
                                                                        {getInitials(inspector.profile.name)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <p className="text-lg">
                                                                    {inspector.profile.name}
                                                                </p>
                                                            </div>
                                                        );
                                                    })}
                                                    <div className="flex items-center justify-between w-full text-muted-foreground">
                                                        <p className="text-lg font-semibold">
                                                            {t("Total")}
                                                        </p>
                                                        <p className="text-lg font-semibold">
                                                            {inspectors.length}
                                                        </p>
                                                    </div>
                                                </HoverCardContent>
                                            </HoverCard>
                                        </div>


                                        <CardFooter className="p-0 gap-0">
                                            <div className="flex gap-2 items-center w-full">
                                                <div className="flex gap-1 text-primary items-center">
                                                    <span className="material-symbols-outlined">
                                                        checklist
                                                    </span>
                                                    <p className="text-xl font-semibold">
                                                        {countPatrolResult(patrol.results).total}
                                                    </p>
                                                </div>
                                                <div className="flex gap-1 text-orange items-center">
                                                    <span className="material-symbols-outlined">
                                                        close
                                                    </span>
                                                    <p className="text-xl font-semibold">
                                                        {countPatrolResult(patrol.results).fail}
                                                    </p>
                                                </div>
                                                <div className="flex gap-1 text-destructive items-center">
                                                    <span className="material-symbols-outlined">
                                                        error
                                                    </span>
                                                    <p className="text-xl font-semibold">
                                                        {countPatrolResult(patrol.results).defect}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardFooter>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel
                                        onClick={() => handleCloseDialog()}
                                    >
                                        {t("Cancel")}
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 rounded-md px-4 text-lg font-bold"
                                        onClick={() => {
                                            exportData(patrol, patrol.results);
                                            handleCloseDialog();
                                            toast({
                                                variant: "success",
                                                title: a("ExportReportPatrolTitle"),
                                                description: a("ExportReportPatrolDescription"),
                                            });
                                        }}
                                    >
                                        <span className="material-symbols-outlined text-2xl me-2">
                                            ios_share
                                        </span>
                                        {t("Export")}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className='text-2xl font-bold'>
                    <p>{patrol?.preset.title}</p>
                </div>

                <div className='flex flex-col gap-2'>
                    <div className='flex flex-row justify-between'>
                        <div className='flex flex-row gap-1 justify-start'>
                            <span className="material-symbols-outlined text-muted-foreground w-[22px] h-[22px]">
                                description
                            </span>
                            <p className='text-lg text-muted-foreground'>{formatId(patrol.id)}</p>
                        </div>

                        <div>
                            <BadgeCustom
                                iconName={getPatrolStatusVariant(patrol.status).iconName}
                                showIcon={true}
                                showTime={false}
                                variant={getPatrolStatusVariant(patrol.status).variant}
                            >
                                {s(patrol.status)}
                            </BadgeCustom>
                        </div>
                    </div>

                    <div className='flex flex-row justify-between'>
                        <div className="flex flex-col gap-2 p-0">
                            <HoverCard open={hoverState['overview']?.isClicked || hoverState['overview']?.isHovered}>
                                <HoverCardTrigger
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClick('overview', e)
                                    }}
                                    onMouseEnter={() => handleMouseEnter('overview')}
                                    onMouseLeave={() => handleMouseLeave('overview')}
                                    asChild
                                >
                                    <div className="flex text-muted-foreground items-center">
                                        <span className="material-symbols-outlined me-1">
                                            person_search
                                        </span>
                                        {inspectors.length > 0 && (
                                            <div className="flex items-center me-1 truncate max-w-[190px]">
                                                <p className="text-xl me-2.5 truncate">{inspectors[0].profile.name}</p>
                                            </div>
                                        )}
                                        {inspectors.map((inspector, idx) => {
                                            return (
                                                <Avatar key={idx} className="custom-shadow ms-[-10px]">
                                                    <AvatarImage
                                                        src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${inspector?.profile?.image?.path}`}
                                                    />
                                                    <AvatarFallback id={inspector.id.toString()}>
                                                        {getInitials(inspector.profile.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            );
                                        })}

                                        {inspectors.length > 5 && (
                                            <Avatar className="custom-shadow flex items-center justify-center ms-[-10px]">
                                                <AvatarImage src="" />
                                                <span className="absolute text-card-foreground text-base font-semibold">
                                                    +{inspectors.length - 5}
                                                </span>
                                                <AvatarFallback id={'0'}></AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                </HoverCardTrigger>
                                <HoverCardContent
                                    className="flex flex-col w-fit border-none gap-4 px-6 py-4 custom-shadow">
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="material-symbols-outlined">
                                            person_search
                                        </span>
                                        <p className="text-lg font-semibold">
                                            {t("InspectorList")}
                                        </p>
                                    </div>
                                    {inspectors.map((inspector, idx) => {
                                        return (
                                            <div key={idx} className="flex items-center w-full py-2 gap-1 border-b-2 border-secondary">
                                                <Avatar className="custom-shadow ms-[-10px] me-2.5">
                                                    <AvatarImage
                                                        src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${inspector?.profile?.image?.path}`}
                                                    />
                                                    <AvatarFallback id={inspector.id.toString()}>
                                                        {getInitials(inspector.profile.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <p className="text-lg">{inspector.profile.name}</p>
                                            </div>
                                        );
                                    })}
                                    <div className="flex items-center justify-between w-full text-muted-foreground">
                                        <p className="text-lg font-semibold">
                                            {t("Total")}
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {inspectors.length}
                                        </p>
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                        </div>

                        <div>
                            <div className='flex flex-row gap-2'>
                                <div className="flex gap-1 text-primary items-center">
                                    <span className="material-symbols-outlined">checklist</span>
                                    <p className="text-xl font-semibold">{countPatrolResult(patrol.results).total}</p>
                                </div>
                                <div className="flex gap-1 text-orange items-center">
                                    <span className="material-symbols-outlined">close</span>
                                    <p className="text-xl font-semibold">{countPatrolResult(patrol.results).fail}</p>
                                </div>
                                <div className="flex gap-1 text-destructive items-center">
                                    <span className="material-symbols-outlined">
                                        error
                                    </span>
                                    <p className="text-xl font-semibold">{countPatrolResult(patrol.results).defect}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            <ScrollArea
                className="h-full w-full rounded-md flex-1 
            [&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-400px)]"
            >
                <div className='flex flex-col gap-4'>
                    {/* second block */}
                    <div className='grid xl:grid-cols-4 gap-4 sm:grid-cols-2 '>
                        <div className='flex flex-col gap-4 bg-card px-6 py-4 rounded-md'>
                            <div className='flex flex-row justify-between'>
                                <p className='text-xl'>{d("TotalPass")}</p>
                                <div className='flex items-center justify-center bg-green/20 rounded-full h-9 w-9'>
                                    <span className="flex justify-center items-center material-symbols-outlined text-green w-[22px] h-[22px]">
                                        check
                                    </span>
                                </div>
                            </div>
                            <p className='text-2xl font-bold'>{countPatrolResult(patrol.results).pass}</p>
                        </div>

                        <div className='flex flex-col gap-4 bg-card px-6 py-4 rounded-md'>
                            <div className='flex flex-row justify-between'>
                                <p className='text-xl'>{d("TotalFails")}</p>
                                <div className='flex items-center justify-center bg-destructive/20 rounded-full h-9 w-9'>
                                    <span className="flex justify-center items-center material-symbols-outlined text-destructive w-[22px] h-[22px]">
                                        close
                                    </span>
                                </div>
                            </div>
                            <p className='text-2xl font-bold'>{countPatrolResult(patrol.results).fail}</p>
                        </div>

                        <div className='flex flex-col gap-4 bg-card px-6 py-4 rounded-md'>
                            <div className='flex flex-row justify-between'>
                                <p className='text-xl'>{d("TotalReports")}</p>
                                <div className='flex items-center justify-center bg-orange/20 rounded-full h-9 w-9'>
                                    <span className="flex justify-center items-center material-symbols-outlined text-orange w-[22px] h-[22px]">
                                        campaign
                                    </span>
                                </div>
                            </div>
                            <p className='text-2xl font-bold'>{countPatrolResult(patrol.results).defect}</p>
                        </div>

                        <div className='flex flex-col gap-4 bg-card px-6 py-4 rounded-md'>
                            <div className='flex flex-row justify-between'>
                                <p className='text-xl'>{d("TotalComments")}</p>
                                <div className='flex items-center justify-center bg-yellow/20 rounded-full h-9 w-9'>
                                    <span className="flex justify-center items-center material-symbols-outlined text-yellow w-[22px] h-[22px]">
                                        chat
                                    </span>
                                </div>
                            </div>
                            <p className='text-2xl font-bold'>{countPatrolResult(patrol.results).comment}</p>
                        </div>
                    </div>

                    {/* third block */}
                    <div className='flex flex-col rounded-md px-6 py-4 bg-card gap-4'>
                        <p className='text-2xl font-bold'>{d("DefectReported")}</p>

                        <div className="rounded-md map-container cursor-default user-select-none ">
                            <Map disable={true} initialSelectedZones={getZoneAllDefects()} />
                        </div>

                        <ScrollArea
                            className="rounded-md sm:w-[654px] lg:w-full whitespace-nowrap">
                            <Table className='overflow-hidden sm:w-max lg:w-full'>
                                <TableHeader>
                                    <TableRow className="grid grid-cols-12 w-full">
                                        <TableHead className='sm:col-span-3 sm:w-[200px] lg:col-span-2'>
                                            {t("Name")}
                                        </TableHead>
                                        <TableHead className='sm:col-span-1 lg:col-span-2'>
                                            {t("Type")}
                                        </TableHead>
                                        <TableHead className='sm:col-span-2 lg:col-span-2'>
                                            {t("Reporter")}
                                        </TableHead>
                                        <TableHead className='sm:col-span-2 lg:col-span-2'>
                                            {t("Timestamp")}
                                        </TableHead>
                                        <TableHead className='sm:col-span-2 lg:col-span-2'>
                                            {t("Zone")}
                                        </TableHead>
                                        <TableHead className='sm:col-span-2 lg:col-span-2'>
                                            {t("Status")}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    <ScrollArea
                                        className="rounded-md w-full lg:[&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-500px)] sm:[&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-888px)]"
                                    >
                                        {defects?.length === 0 ? (
                                            <tr className="flex sm:w-[654px] sm:h-[388px] lg:w-full lg:h-full">
                                                <td colSpan={5} className="w-full text-center py-0">
                                                    <NotFound
                                                        icon="campaign"
                                                        title="NoDefectsReported"
                                                        description="NoDefectsDescription"
                                                    />
                                                </td>
                                            </tr>
                                        ) : (defects.map((defect, index) => (
                                            <TableRow key={index} className="grid grid-cols-12 w-full">
                                                <TableCell className="sm:text-sm lg:text-base sm:col-span-3 sm:w-[200px] lg:col-span-2 flex items-center min-w-0">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span className="truncate">{defect.name}</span>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="bottom" className="ml-[129px]">
                                                                <p className="max-w-[200px] break-words">{defect.name}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </TableCell>
                                                <TableCell className='sm:col-span-1  lg:col-span-2'>
                                                    <BadgeCustom
                                                        iconName={getItemTypeVariant(defect.type).iconName}
                                                        showIcon={true}
                                                        showTime={false}
                                                        shape='square'
                                                        variant={getItemTypeVariant(defect.type).variant}
                                                        hideText={windowWidth > 1024 ? false : true}

                                                    >
                                                        {s(defect.type)}
                                                    </BadgeCustom>
                                                </TableCell>
                                                <TableCell className='sm:col-span-2 lg:col-span-2'>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1">
                                                            <Avatar className="custom-shadow h-[35px] w-[35px]">
                                                                <AvatarImage
                                                                    src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${defect.user.profile.image?.path}`}
                                                                />
                                                                <AvatarFallback id={defect.user.id.toString()}>
                                                                    {getInitials(defect.user.profile.name)}
                                                                </AvatarFallback>
                                                            </Avatar>

                                                            <p className="text-card-foreground text-lg xl:block">{defect.user.profile.name}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className='sm:col-span-2 lg:col-span-2 ps-4'>
                                                    <p>{formatTime(defect.startTime, locale)}</p>
                                                </TableCell>
                                                <TableCell className='sm:col-span-2 lg:col-span-2'>
                                                    <p>{z(defect.zone.name)}</p>
                                                </TableCell>
                                                <TableCell className='sm:col-span-2 lg:col-span-2'>
                                                    <BadgeCustom
                                                        iconName={getDefectStatusVariant(defect.status).iconName}
                                                        showIcon={true}
                                                        showTime={false}
                                                        variant={getDefectStatusVariant(defect.status).variant}
                                                        hideText={windowWidth > 1024 ? false : true}
                                                    >
                                                        {s(defect.status)}
                                                    </BadgeCustom>
                                                </TableCell>
                                            </TableRow>
                                        )))}


                                    </ScrollArea>
                                </TableBody>
                            </Table>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </div>
                    {/* forth block */}
                    <div className='flex xl:flex-row gap-4 justify-between sm:flex-col'>

                        {/* Patrol Duration */}
                        <div className="flex flex-col xl:flex-row gap-4 justify-between w-full">
                            <div className="flex flex-col py-4 px-6 w-full rounded-md custom-shadow bg-card">
                                <h1 className="text-2xl font-semibold text-card-foreground">
                                    {d("PatrolDuration")}
                                </h1>
                                <div className='flex flex-col pt-6'>
                                    <RadialChart duration={patrol.duration} />
                                </div>
                            </div>
                        </div>

                        {/* Defect Category */}
                        <div className="flex flex-col xl:flex-row gap-4 justify-between w-full">
                            <div className="flex flex-col py-4 px-6 w-full rounded-md custom-shadow bg-card">
                                <h1 className="text-2xl font-semibold text-card-foreground">
                                    {d("DefectCategory")}
                                </h1>
                                <DonutGraph key={Date.now()} chartData={defectCategory.chartData} trend={null} />
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea >
        </div >
    )
}
