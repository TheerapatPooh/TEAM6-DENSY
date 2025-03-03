import { IDefect, IPatrol, IPatrolChecklist, IPatrolResult, IUser } from "@/app/type";
import Loading from "@/components/loading";
import { useSocket } from "@/components/socket-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchData } from "@/lib/utils";
import { notFound, useParams } from "next/navigation";
import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useDebugValue } from "react";
import { boolean, IpVersion } from "zod";
import { AlertCustom } from "@/components/alert-custom";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

interface IPatrolContext {
    patrol: IPatrol | null;
    patrolResults: IPatrolResult[];
    user: IUser | null;
    lock: boolean;
    isAlertOpen: boolean;
    handleResult: (patrolResult: IPatrolResult) => void;
    toggleLock: () => void;
    handleStartPatrol: () => void;
    handleFinishPatrol: () => void;
    fetchRealtimeData: (defect: IDefect, actionType: string) => void;
    calculateProgress: () => number;
    handleOpenDialog: () => void
    handleCloseDialog: () => void
    itemCounts: (patrol: IPatrol, results: IPatrolResult[]) => void
    mounted: boolean;
    canFinish: boolean;
    defects: IDefect[]
    countItems: number
    countFails: number
    countDefects: number
    patrolUser: IUser[]
    isHovered: boolean
    handleMouseLeave: () => void
    handleMouseEnter: () => void
    formatZone: (patrol: IPatrol) => string
    formatTimeDate: (dateStr: string) => string
    formatId: (id: number) => string
    formatDate: (dateStr: string) => string
}

const PatrolContext = createContext<IPatrolContext | undefined>(undefined);

export const PatrolProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [patrol, setPatrol] = useState<IPatrol | null>(null);
    const [defects, setDefects] = useState<IDefect[]>([]);
    const [patrolResults, setPatrolResults] = useState<IPatrolResult[]>([]);
    const [user, setUser] = useState<IUser | null>(null);
    const { socket, isConnected } = useSocket();
    const [lock, setLock] = useState(false);
    const [mounted, setMounted] = useState(false);
    const params = useParams();
    const a = useTranslations("Alert");

    const [patrolUser, setPatrolUser] = useState<IUser[] | null>([])
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const [countItems, setCountItems] = useState(0);
    const [countFails, setCountFails] = useState(0);
    const [countDefects, setCountDefects] = useState(0);

    const itemCounts = (patrol: IPatrol, results: IPatrolResult[]) => {
        let itemCounts = 0
        patrol?.patrolChecklists.forEach(patrolChecklist => {
            // นับจำนวน item แต่ละประเภท
            patrolChecklist.checklist.items.forEach(item => {
                item.itemZones.forEach(() => {
                    itemCounts++
                })
            });
        });

        let countItems = itemCounts;
        let countFails = 0;
        let countDefects = 0;

        if (patrol?.status !== "pending" && patrol?.status !== "scheduled") {
            if (results) {
                for (const patrolResult of results) {
                    if (patrolResult.status === false) {
                        countFails++;
                        if (patrolResult.defects && patrolResult.defects.length !== 0) {
                            countDefects += patrolResult.defects.length;
                        }
                    }
                }
            }
        }

        setCountItems(countItems)
        setCountFails(countFails)
        setCountDefects(countDefects)

        return { countItems, countFails, countDefects }
    }


    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB');
    };

    const formatId = (id: number): string => {
        return `P${id.toString().padStart(4, '0')}`;
    };

    const formatTimeDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}.${minutes}`;
    };

    const formatZone = (patrol: IPatrol) => {
        const zones = new Set<string>();
        patrol.patrolChecklists.forEach((checklist: any) => {
            checklist.checklist.items.forEach((item: any) => {
                item.itemZones.forEach((zoneObj: any) => {
                    const zoneName = zoneObj.zone.name;
                    if (typeof zoneName === "string") {
                        zones.add(zoneName);
                    }
                });
            });
        });
        return Array.from(zones)
            .map(
                (zone) =>
                    zone
                        .split("_") // แยกคำตาม `_`
                        .map(
                            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                        ) // ตัวอักษรตัวแรกพิมพ์ใหญ่
                        .join(" ") // รวมคำด้วยช่องว่าง
            )
            .join(", "); // รวมรายการด้วยเครื่องหมายคอมมา
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleOpenDialog = () => {
        setIsAlertOpen(true);
    };

    const handleCloseDialog = () => {
        setIsAlertOpen(false)
    }

    const totalResults = patrolResults?.length || 0
    const checkedResults =
        patrolResults?.filter((res) => res.status !== null).length || 0;
    const canFinish = checkedResults === totalResults;

    const getPatrolData = async () => {
        if (params.id) {
            try {
                const data = await fetchData("get", `/patrol/${params.id}?preset=true&result=true`, true);
                setPatrol(data);
                // ดึงข้อมูลจาก localStorage เมื่อ patrol.id มีค่า
                const savedResults = localStorage.getItem(`patrolResults_${patrol.id}`);
                let mergedResults = [...data.results]; // เริ่มต้นด้วยข้อมูลจาก server
                console.log(mergedResults)
                if (savedResults) {
                    const savedResultsParsed = JSON.parse(savedResults);

                    // รวมข้อมูลจาก localStorage เข้ากับข้อมูลจาก server
                    savedResultsParsed.forEach((savedResult: IPatrolResult) => {
                        const existingIndex = mergedResults.findIndex((r) => r.id === savedResult.id);

                        if (existingIndex !== -1) {
                            // ถ้ามีผลลัพธ์ใน server ที่มี id เดียวกัน, ให้รวมข้อมูล (ไม่ทับ)
                            mergedResults[existingIndex] = {
                                ...mergedResults[existingIndex],
                                ...savedResult,
                            };
                        } else {
                            // ถ้าไม่มี, ให้เพิ่มผลลัพธ์จาก localStorage ไป
                            mergedResults.push(savedResult);
                        }
                    });
                }

                // อัปเดต state ด้วยข้อมูลที่รวมกัน
                setPatrolResults(mergedResults);
            } catch (error) {
                console.error("Failed to fetch patrol data:", error);
            }
        }
    };

    const getDefectData = async () => {
        try {
            const defectFetch = await fetchData("get", `/patrol/${params.id}/defects`, true);
            setDefects(defectFetch);
        } catch (error) {
            console.error("Failed to fetch defects data:", error);
        }
    };

    const calculateProgress = () => {
        if (!patrol) return 0;
        const checkedResults = patrolResults.filter(
            (res) => res.status !== null
        ).length;

        if (totalResults === 0) return 0;
        return (checkedResults / totalResults) * 100;
    };

    const toggleLock = () => setLock((prev) => !prev);

    const handleResult = (patrolResult: IPatrolResult) => {
        setPatrolResults((prevResults) => {
            const existingIndex = prevResults.findIndex(
                (r) => r.id === patrolResult.id
            );

            let updatedResults;
            if (existingIndex !== -1) {
                updatedResults = [...prevResults];
                updatedResults[existingIndex] = {
                    ...updatedResults[existingIndex],
                    ...patrolResult,
                };
            } else {
                updatedResults = [...prevResults, patrolResult];
            }
            if (socket && patrol?.id) {
                socket.emit("update_patrol_result", {
                    patrolId: patrol.id,
                    result: patrolResult
                });
            }

            return updatedResults
        });
    };

    const handleStartPatrol = async () => {
        setIsAlertOpen(false)

        if (!patrol) return;
        const patrolId = patrol.id;
        const data = {
            status: patrol?.status,
            checklists: patrol?.patrolChecklists,
        };

        try {
            const startPatrol = await fetchData(
                "put",
                `/patrol/${patrolId}/start`,
                true,
                data
            );
            socket.emit("start_patrol", {
                patrolId: patrol.id,
                patrolData: startPatrol,
            });
            setPatrol(startPatrol)
            setPatrolResults(startPatrol.results)
            toast({
                variant: "default",
                title: a("PatrolStartTitle"),
                description: a("PatrolStartDescription"),
            });
        } catch (error) {
            console.error("Error starting patrol:", error);
        }
    };

    const handleFinishPatrol = async () => {
        if (!patrol) return;

        const data = {
            status: patrol.status,
            checklists: patrol.patrolChecklists,
            results: patrolResults,
            startTime: patrol.startTime
        };

        let resultCount = 0;
        for (const checklist of patrol.patrolChecklists) {
            for (const item of checklist.checklist.items) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                for (const zone of item.itemZones) {
                    resultCount++;
                }
            }
        }

        if (data.results.length === resultCount) {
            try {
                localStorage.removeItem(`patrolResults_${patrol.id}`);
                const finishPatrol = await fetchData(
                    "put",
                    `/patrol/${patrol.id}/finish`,
                    true,
                    data
                );
                socket.emit("finish_patrol", {
                    patrolId: patrol.id,
                    patrolData: finishPatrol
                });
                setPatrol(finishPatrol)

                toast({
                    variant: "default",
                    title: a("PatrolFinishTitle"),
                    description: a("PatrolFinishDescription"),
                });
            } catch (error) {
                console.error("Error finishing patrol:", error);
            }
        }
    };

    const getUserData = async () => {
        try {
            const userfetch = await fetchData("get", "/user?profile=true&image=true", true);
            setUser(userfetch);
        } catch (error) {
            console.error("Failed to fetch profile data:", error);
        }
    };

    const getPatrolUserData = async () => {
        try {
            const patrolUserFetch = await fetchData("get", `/patrol/${params.id}/user`, true);
            setPatrolUser(patrolUserFetch);
        } catch (error) {
            console.error("Failed to fetch profile data:", error);
        }
    };

    const fetchRealtimeData = (defect: IDefect, actionType: string) => {
        if (actionType === "create") {
            setDefects((prevDefects) => {
                // ตรวจสอบว่ามี defects ก่อนหน้าหรือไม่
                if (prevDefects && prevDefects.length > 0) {
                    return [...prevDefects, defect]; // เพิ่ม defect ไปต่อท้าย
                } else {
                    return [defect]; // ถ้าไม่มี defect ก่อนหน้า ให้เริ่มต้นใหม่ด้วย defect ตัวแรก
                }
            });
        } else {
            setDefects((prevDefects) =>
                prevDefects.map((d) => (d.id === defect.id ? defect : d))
            );
        }
        // อัปเดต patrolResults
        setPatrolResults((prevResults) => {
            return prevResults.map((patrolResult) => {
                if (patrolResult.id === defect.patrolResultId) {
                    const updatedPatrolResult = {
                        ...patrolResult,
                        defects: [...patrolResult.defects, defect],
                    };

                    // ส่งเฉพาะ `patrolResult` ที่อัปเดตไปยังเซิร์ฟเวอร์
                    if (socket && patrolResult.id) {
                        socket.emit("update_patrol_result", {
                            patrolId: patrolResult.patrolId,
                            result: updatedPatrolResult,
                        });
                    }

                    return updatedPatrolResult;
                }
                return patrolResult;
            });
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getUserData();
                await getPatrolData();
                await getDefectData()
                await getPatrolUserData()
            } catch (error) {
                console.error("Error loading data: ", error);
            } finally {
                setMounted(true);
            }
        };
        fetchData();
    }, [patrol?.id])

    useEffect(() => {
        if (patrol && patrol.status !== 'on_going') {
            localStorage.removeItem(`patrolResults_${patrol.id}`);
        }
    }, [patrol])

    useEffect(() => {
        if (patrol?.id && patrolResults && patrol.status === 'on_going') {
            // บันทึกข้อมูล patrolResults ลง localStorage ด้วย key patrolResults_<patrol.id>
            localStorage.setItem(
                `patrolResults_${patrol.id}`,
                JSON.stringify(patrolResults)
            );
        }
    }, [patrolResults, patrol]);

    useEffect(() => {
        if (socket && isConnected && patrol?.id && user?.id) {
            socket.emit("join_patrol", patrol.id);

            // รับข้อมูลเริ่มต้นเมื่อเข้าร่วมห้อง
            const handleInitialData = (initialResults: IPatrolResult[]) => {
                setPatrolResults(prev => {
                    const merged = [...prev];
                    initialResults.forEach(result => {
                        const existingIndex = merged.findIndex(r => r.id === result.id);
                        if (existingIndex !== -1) {
                            merged[existingIndex] = {
                                ...merged[existingIndex],
                                ...result
                            };
                        } else {
                            merged.push(result);
                        }
                    });
                    return merged;
                });
            };

            // รับข้อมูลอัปเดตแบบ real-time
            const handleResultUpdate = (incomingResult: IPatrolResult) => { // รับทีละรายการ
                setPatrolResults((prev) => {
                    const existingIndex = prev.findIndex(r => r.id === incomingResult.id);
                    if (existingIndex !== -1) {
                        const updated = [...prev];
                        updated[existingIndex] = { ...updated[existingIndex], ...incomingResult };
                        return updated;
                    }
                    return [...prev, incomingResult];
                });
            };

            const handlePatrolStarted = (data: { patrolId: string; patrolData: IPatrol }) => {
                setPatrol(data.patrolData);
                setPatrolResults(data.patrolData.results);
            };

            const handlePatrolFinished = (data: { patrolId: string; patrolData: IPatrol }) => {
                localStorage.removeItem(`patrolResults_${data.patrolId}`);
                getPatrolData();
            };

            socket.on("initial_patrol_data", handleInitialData);
            socket.on("patrol_started", handlePatrolStarted);
            socket.on("patrol_result_update", handleResultUpdate);
            socket.on("patrol_finished", handlePatrolFinished);

            return () => {
                socket.off("initial_patrol_data", handleInitialData);
                socket.off("patrol_started", handlePatrolStarted);
                socket.off("patrol_result_update", handleResultUpdate);
                socket.off("patrol_finished", handlePatrolFinished);
            };
        }
    }, [socket, isConnected, patrol?.id, user?.id]);

    if (!mounted) {
        return <Loading />;
    }

    if (mounted && !patrolResults) {
        return notFound();
    }

    return (
        <PatrolContext.Provider
            value={{
                patrol,
                patrolResults,
                // results,
                user,
                lock,
                isAlertOpen,
                mounted,
                canFinish,
                defects,
                countItems,
                countFails,
                countDefects,
                patrolUser,
                isHovered,
                formatDate,
                formatId,
                formatTimeDate,
                formatZone,
                handleMouseEnter,
                handleMouseLeave,
                itemCounts,
                toggleLock,
                calculateProgress,
                handleResult,
                handleStartPatrol,
                fetchRealtimeData,
                handleFinishPatrol,
                handleOpenDialog,
                handleCloseDialog,
            }}
        >
            {children}
        </PatrolContext.Provider>
    );
}

export const usePatrol = () => {
    const context = useContext(PatrolContext);
    if (!context) {
        throw new Error('usePatrol must be used within a PatrolProvider');
    }
    return context;
};