"use client";
import React, { useState, useEffect, useRef } from "react";
import { fetchData } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import BadgeCustom from "@/components/badge-custom";
import {
  IDefect,
  IPatrol,
  IPatrolChecklist,
  IPatrolResult,
  patrolStatus,
  IUser,
} from "@/app/type";
import ReportDefect from "@/components/report-defect";
import PatrolChecklist from "@/components/patrol-checklist";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useRouter } from "next/navigation";
import { exportData, getPatrolStatusVariant } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useSocket } from "@/components/socket-provider";
import { Progress } from "@/components/ui/progress";
import Loading from "@/components/loading";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [patrol, setPatrol] = useState<IPatrol | null>(null);
  const [results, setResults] = useState<IPatrolResult[]>([]);
  const [otherResults, setOtherResults] = useState<IPatrolResult[]>([]);
  const [patrolResults, setPatrolResults] = useState<IPatrolResult[]>([]);
  const [defects, setDefects] = useState<IDefect[]>([]);
  const [user, setUser] = useState<IUser>();
  const { socket, isConnected } = useSocket();
  const [lock, setLock] = useState(false);
  const locale = useLocale()

  const params = useParams();
  const router = useRouter();
  const t = useTranslations("General");
  const s = useTranslations("Status");

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

  const calculateProgress = () => {
    if (!patrol) return 0;
    const checkedResults = patrolResults.filter(
      (res) => res.status !== null
    ).length;

    if (totalResults === 0) return 0;
    return (checkedResults / totalResults) * 100;
  };

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

  const toggleLock = () => {
    setLock((prevLock) => !prevLock);
  };

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
    if (!patrol) return;
    const patrolId = patrol.id;
    const data = {
      status: patrol?.status,
      checklists: patrol?.patrolChecklists,
    };

    try {
      await fetchData(
        "put",
        `/patrol/${patrolId}/start`,
        true,
        data
      );
    } catch (error) {
      console.error("Error starting patrol:", error);
    }
    window.location.reload();
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

    if (data.result.length === resultCount) {
      try {
        localStorage.removeItem(`patrolResults_${patrol.id}`);
        localStorage.removeItem(`otherResults_${patrol.id}`);
        await fetchData(
          "put",
          `/patrol/${patrol.id}/finish`,
          true,
          data
        );
      } catch (error) {
        console.error("Error finishing patrol:", error);
      }
    }
    window.location.reload();
  };

  const getUserData = async () => {
    try {
      const userfetch = await fetchData("get", "/user?profile=true&image=true", true);
      setUser(userfetch);
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getUserData();
        await getPatrolData();
        await getDefectData()
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

  if (!patrol || !mounted) {
    return (
      <Loading />
    )
  }

  return (
    <div className="p-4">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center p-0 justify-center text-center gap-2">
            <Button
              variant="ghost"
              className="flex hover:bg-secondary w-[40px] h-[40px]"
            >
              <span className="material-symbols-outlined text-card-foreground">
                error
              </span>
            </Button>
            <div className="flex flex-col h-full justify-start w-full">
              <p className="text-2xl font-bold">{patrol.preset.title}</p>
              <Progress value={calculateProgress()} />
            </div>
          </div>
          <div>
            {(() => {
              const { iconName, variant } = getPatrolStatusVariant(patrol.status);
              return (
                <BadgeCustom
                  iconName={iconName}
                  showIcon={true}
                  showTime={false}
                  variant={variant}
                >
                  {s(patrol.status)}
                </BadgeCustom>
              );
            })()}
          </div>
        </div>
        <div className="flex flex-col p-4 rounded-md bg-card w-full h-full">
          <Tabs defaultValue="detail">
            <div className="flex w-full justify-between items-center">
              <TabsList className="bg-secondary p-1 h-fit">
                <TabsTrigger value="detail">
                  <span className="material-symbols-outlined mr-2">
                    data_info_alert
                  </span>
                  <p className="font-semibold">{t("Detail")}</p>
                </TabsTrigger>
                <TabsTrigger value="report">
                  <span className="material-symbols-outlined mr-2">
                    Campaign
                  </span>
                  <p className="font-semibold">{t("Report")}</p>
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-4">
                <Button variant={"secondary"} onClick={() => router.push(`/${locale}`)}>
                  {t("Back")}
                </Button>
                {(() => {
                  let iconName: string;
                  let text: string;
                  let variant:
                    | "link"
                    | "default"
                    | "secondary"
                    | "destructive"
                    | "success"
                    | "fail"
                    | "outline"
                    | "ghost"
                    | "primary"
                    | null
                    | undefined;
                  let disabled: boolean;
                  let handleFunction: any;
                  switch (patrol.status as patrolStatus) {
                    case "completed":
                      variant = "outline";
                      iconName = "ios_share";
                      text = "Export";
                      disabled = false;
                      handleFunction = () => {
                        exportData(patrol, patrolResults);
                      };
                      break;
                    case "on_going":
                      variant = "primary";
                      iconName = "Check";
                      text = "Finish";
                      disabled = false;
                      handleFunction = () => {
                        handleFinishPatrol();
                      };
                      break;
                    case "scheduled":
                      variant = "primary";
                      iconName = "cached";
                      text = "Start";
                      disabled = false;
                      handleFunction = () => {
                        handleStartPatrol();
                      };
                      break;
                    case "pending":
                      variant = "primary";
                      iconName = "cached";
                      text = "Start";
                      disabled = true;
                      handleFunction = () => {
                        handleStartPatrol();
                      };
                      break;
                    default:
                      variant = "primary";
                      iconName = "cached";
                      text = "Start";
                      disabled = true;
                      handleFunction = () => { };
                      break;
                  }
                  return (
                    <div>
                      {patrol.status === "on_going" ? (
                        canFinish ? (
                          <Button
                            variant={variant}
                            onClick={handleFunction}
                            disabled={disabled}
                          >
                            <span className="material-symbols-outlined">
                              {iconName}
                            </span>
                            {t(text)}
                          </Button>
                        ) : (
                          <Button
                            variant={lock ? "secondary" : variant}
                            disabled={disabled}
                            onClick={toggleLock}
                          >
                            <span className="material-symbols-outlined">
                              {lock ? "lock_open" : "lock"}
                            </span>
                            {lock ? t("Unlock") : t("Lock")}
                          </Button>
                        )
                      ) : (
                        <Button
                          variant={variant}
                          onClick={handleFunction}
                          disabled={disabled}
                        >
                          <span className="material-symbols-outlined">
                            {iconName}
                          </span>
                          {t(text)}
                        </Button>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
            <TabsContent value="detail">
              <div className="py-2">
                {patrol.patrolChecklists.map((pc: IPatrolChecklist) => (
                  <div className="mb-4">
                    {user?.profile.name === pc.inspector.profile.name ? (
                      <PatrolChecklist
                        handleResult={handleResult}
                        results={results}
                        patrolChecklist={pc}
                        disabled={
                          patrol.status === "on_going" && !lock ? false : true
                        }
                        patrolResult={patrolResults}
                        user={user}
                      />
                    ) : (
                      <div></div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="report">
              <div className="py-2">
                {defects.map((defect: IDefect) => {
                  return (
                    <div className="py-2">
                      <ReportDefect
                        defect={defect}
                      />
                    </div>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
