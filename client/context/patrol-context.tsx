import { IDefect, IPatrol, IPatrolChecklist, IPatrolResult, IUser } from "@/app/type";
import Loading from "@/components/loading";
import { useSocket } from "@/components/socket-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchData } from "@/lib/utils";
import { useParams } from "next/navigation";
import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useDebugValue } from "react";
import { boolean, IpVersion } from "zod";
import { AlertCustom } from "@/components/alert-custom";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

interface PatrolContextProps {
    patrol: IPatrol | null;
    patrolResults: IPatrolResult[];
    results: IPatrolResult[];
    otherResults: IPatrolResult[];
    user: IUser | null;
    lock: boolean;
    isAlertOpen: boolean;
    handleResult: (result: IPatrolResult) => void;
    mergeResults: (newResults: IPatrolResult[]) => void;
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

const PatrolContext = createContext<PatrolContextProps | undefined>(undefined);

export const PatrolProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [patrol, setPatrol] = useState<IPatrol | null>(null);
    const [results, setResults] = useState<IPatrolResult[]>([]);
    const [defects, setDefects] = useState<IDefect[]>([]);
    const [otherResults, setOtherResults] = useState<IPatrolResult[]>([]);
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
                item.itemZones.forEach(itemZone => {
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

        return {countItems, countFails, countDefects}
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

    const totalResults = patrolResults.length
    const checkedResults =
        patrolResults.filter((res) => res.status !== null).length || 0;
    const canFinish = checkedResults === totalResults;

    const getPatrolData = async () => {
        if (params.id) {
            try {
                const data = await fetchData("get", `/patrol/${params.id}?preset=true`, true);
                const result = await fetchData("get", `/patrol/${params.id}?result=true`, true);
                const savedResults = localStorage.getItem(`patrolResults_${data.id}`);
                const otherResults = localStorage.getItem(`otherResults_${data.id}`);
                if (savedResults) {
                    setResults(JSON.parse(savedResults));
                }
                if (otherResults) {
                    setOtherResults(JSON.parse(otherResults));
                }
                setPatrol(data);
                setPatrolResults(result.results)
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

    const mergeResults = (newResults: IPatrolResult[]) => {
        setPatrolResults((prevPatrolResult = []) => {
            const updatedResults = prevPatrolResult.map((res) => {
                const matchingResult = newResults.find(
                    (newRes) =>
                        res.itemId === newRes.itemId && res.zoneId === newRes.zoneId
                );
                return matchingResult ? { ...res, ...matchingResult } : res;
            });

            const newUniqueResults = newResults.filter(
                (newRes) =>
                    !updatedResults.some(
                        (res) =>
                            res.itemId === newRes.itemId && res.zoneId === newRes.zoneId
                    )
            );

            return [...updatedResults, ...newUniqueResults];
        });
    }

    const handleResult = (result: IPatrolResult) => {
        setResults((prevResults) => {
            const existingIndex = prevResults.findIndex(
                (r) => r.itemId === result.itemId && r.zoneId === result.zoneId
            );

            if (existingIndex !== -1) {
                const updatedResults = [...prevResults];
                updatedResults[existingIndex] = result;
                return updatedResults;
            } else {
                return [...prevResults, result];
            }
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

        const updatedResults = patrolResults.map((result) => {
            const matchedResult = patrolResults.find(
                (res) => res.itemId === result.itemId && res.zoneId === result.zoneId
            );

            if (matchedResult && result.status !== null) {
                return {
                    id: matchedResult.id,
                    status: result.status,
                };
            }

            return null;
        });

        const data = {
            status: patrol.status,
            checklists: patrol.patrolChecklists,
            results: updatedResults,
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
                localStorage.removeItem(`otherResults_${patrol.id}`);
                const finishPatrol = await fetchData(
                    "put",
                    `/patrol/${patrol.id}/finish`,
                    true,
                    data
                );
                toast({
                    variant: "default",
                    title: a("PatrolFinishTitle"),
                    description: a("PatrolFinishDescription"),
                });
                setPatrol(finishPatrol)
            } catch (error) {
                console.error("Error finishing patrol:", error);
            }
        }
        // window.location.reload()
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
            }
        };
        fetchData();
        setMounted(true);
    }, []);

    useEffect(() => {
        if (otherResults) {
            mergeResults(otherResults);
        }
    }, [otherResults]);

    useEffect(() => {
        if (socket && isConnected && patrol?.id && user?.id) {
            socket.emit("join_room", patrol.id);

            const handleResultUpdate = (updatedResults: IPatrolResult[]) => {
                const currentUserResults = updatedResults.filter(
                    (res) => res.inspectorId === user.id
                );

                const otherUserResults = updatedResults.filter(
                    (res) => res.inspectorId !== user.id
                );

                // Avoid unnecessary updates to localStorage
                if (currentUserResults.length > 0) {
                    const savedResults = localStorage.getItem(
                        `patrolResults_${patrol.id}`
                    );
                    const parsedResults: IPatrolResult[] = savedResults
                        ? JSON.parse(savedResults)
                        : [];
                    if (
                        JSON.stringify(parsedResults) !== JSON.stringify(currentUserResults)
                    ) {
                        localStorage.setItem(
                            `patrolResults_${patrol.id}`,
                            JSON.stringify(currentUserResults)
                        );
                    }
                }

                if (otherUserResults.length > 0) {
                    const savedOtherResults = localStorage.getItem(
                        `otherResults_${patrol.id}`
                    );
                    const parsedOtherResults: IPatrolResult[] = savedOtherResults
                        ? JSON.parse(savedOtherResults)
                        : [];
                    if (
                        JSON.stringify(parsedOtherResults) !==
                        JSON.stringify(otherUserResults)
                    ) {
                        localStorage.setItem(
                            `otherResults_${patrol.id}`,
                            JSON.stringify(otherUserResults)
                        );
                    }
                }

                setOtherResults(otherUserResults);
                mergeResults([...results, ...otherUserResults]);
            };

            socket.on("patrol_result_update", handleResultUpdate);

            return () => {
                socket.off("patrol_result_update", handleResultUpdate);
            };
        }
    }, [socket, isConnected, patrol?.id, user?.id, results]);

    const lastEmittedResults = useRef<IPatrolResult[]>([]);

    useEffect(() => {
        if (socket && patrol?.id) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const handleNewUserJoin = (userId: string) => {

                const savedResults = localStorage.getItem(`patrolResults_${patrol.id}`);
                if (savedResults) {
                    try {
                        const parsedResults: IPatrolResult[] = JSON.parse(savedResults);
                        socket.emit("patrol_result_update", parsedResults, patrol.id);
                    } catch (error) {
                        console.error("Error parsing saved results:", error);
                    }
                }
            };

            socket.on("new_user_joined", handleNewUserJoin);

            return () => {
                socket.off("new_user_joined", handleNewUserJoin);
            };
        }
    }, [socket, patrol?.id]);

    useEffect(() => {
        if (socket && isConnected && results.length > 0 && patrol) {
            const uniqueResults = results.map(
                ({ inspectorId, id, itemId, zoneId, status }) => ({
                    inspectorId,
                    id,
                    itemId,
                    zoneId,
                    status,
                })
            );

            const hasChanged =
                uniqueResults.length !== lastEmittedResults.current.length ||
                uniqueResults.some(
                    (result, index) =>
                        result.id !== lastEmittedResults.current[index]?.id ||
                        result.itemId !== lastEmittedResults.current[index]?.itemId ||
                        result.zoneId !== lastEmittedResults.current[index]?.zoneId ||
                        result.status !== lastEmittedResults.current[index]?.status
                );

            if (hasChanged) {
                socket.emit("patrol_result_update", uniqueResults, patrol.id);
                mergeResults([...results, ...uniqueResults]);
                localStorage.setItem(
                    `patrolResults_${patrol.id}`,
                    JSON.stringify(results)
                );

                lastEmittedResults.current = results;
            }
        }
    }, [results]);

    useEffect(() => {
        const savedResults = localStorage.getItem(`patrolResults_${patrol?.id}`);
        if (savedResults) {
            const parsedResults = JSON.parse(savedResults);
            setResults(parsedResults);
        }
    }, [patrol?.id]);

    return (
        <PatrolContext.Provider
            value={{
                patrol,
                patrolResults,
                results,
                otherResults,
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
                mergeResults,
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