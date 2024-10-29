"use client";

import React, { useState, useEffect } from "react";
import { fetchData } from "@/lib/api";
import { Button } from "@/components/ui/button";
import BadgeCustom from "@/components/badge-custom";
import {
  Checklist,
  Patrol,
  PatrolResult,
  patrolStatus,
  User,
} from "@/app/type";
import ReportDefect from "@/components/defect";
import PatrolChecklist from "@/components/patrol-checklist";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useRouter } from "next/navigation";
import { exportData } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useSocket } from "@/components/socket-provider"
import { Progress } from "@/components/ui/progress";
import { SocketIndicator } from "@/components/socket-indicator";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [patrol, setPatrol] = useState<Patrol | null>(null);
  const [results, setResults] = useState<PatrolResult[]>([]);
  const [otherResults, setOtherResults] = useState<PatrolResult[]>([]);

  const [profile, setProfile] = useState<User>();
  const { socket, isConnected } = useSocket();
  const [allChecked, setAllChecked] = useState(false);
  const [lock, setLock] = useState(false);

  const params = useParams();
  const router = useRouter();
  const t = useTranslations("General");
  const s = useTranslations("Status");
  const getPatrolData = async () => {
    if (params.id) {
      try {
        const data = await fetchData("get", `/patrol/${params.id}`, true);
        setPatrol(data);
      } catch (error) {
        console.error("Failed to fetch patrol data:", error);
      }
    }
  };

  const checkIfAllChecked = () => {
    if (!patrol || !profile) return false;

    let totalItemsToCheck = 0;
    patrol.checklist.forEach((checklist) => {
      if (checklist.inspector.id === profile.id) {
        checklist.item.forEach((item) => {
          totalItemsToCheck += item.zone.length;
        });
      }
    });

    const completedResults = results.filter(
      (result) => result.status !== null
    ).length;

    return completedResults >= totalItemsToCheck;
  };

  useEffect(() => {
    const allDone = checkIfAllChecked();
    setAllChecked(allDone);
  }, [results, patrol]);

  const calculateProgress = () => {
    if (!patrol) return 0;

    const totalResults = patrol.result.length;
    const checkedResults = patrol.result.filter((res) => res.status !== null).length;

    if (totalResults === 0) return 0;
    console.log("total: ", totalResults, " check: ", checkedResults)
    return (checkedResults / totalResults) * 100;
  };

  const mergeResults = (newResults: PatrolResult[]) => {
    setPatrol((prevPatrol) => {
      if (!prevPatrol) return null;

      const updatedResults = [...prevPatrol.result];

      newResults.forEach((newResult) => {
        const existingIndex = updatedResults.findIndex(
          (res) => res.itemId === newResult.itemId && res.zoneId === newResult.zoneId
        );

        if (existingIndex !== -1) {
          updatedResults[existingIndex] = { ...updatedResults[existingIndex], ...newResult };
        }
      });

      const updatedPatrol = {
        ...prevPatrol,
        result: updatedResults,
      };
      console.log('update', updatedPatrol)
      return updatedPatrol;
    });
  };

  const toggleLock = () => {
    setLock((prevLock) => !prevLock)
  }
  const handleResult = (result: PatrolResult) => {
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
      checklist: patrol?.checklist,
    };
    try {
      const response = await fetchData(
        "put",
        `/patrol/${patrolId}/start`,
        true,
        data
      );
      if (response) {
        console.log("Patrol started successfully:", response);
      }
    } catch (error) {
      console.error("Error starting patrol:", error);
    }
    window.location.reload();
  };

  const handleFinishPatrol = async () => {
    if (!patrol) return;
    const updatedResults = results.map((result) => {
      const matchedResult = patrol.result.find(
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
      checklist: patrol.checklist,
      result: updatedResults,
    };
    let resultCount = 0;
    for (const checklist of patrol.checklist) {
      if (checklist.inspector.id === profile?.id) {
        for (const item of checklist.item) {
          for (const zone of item.zone) {
            resultCount++;
          }
        }
      }
    }

    if (data.result.length === resultCount) {
      console.log(data);
      try {
        const response = await fetchData(
          "put",
          `/patrol/${patrol.id}/finish`,
          true,
          data
        );
        if (response) {
          console.log("Patrol finished successfully:", response);
        }
      } catch (error) {
        console.error("Error finishing patrol:", error);
      }
    }
  };
  const getProfileData = async () => {
    try {
      const profilefetch = await fetchData("get", "/profile", true);
      setProfile(profilefetch);
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getProfileData();
        await getPatrolData();

        const savedResults = localStorage.getItem('patrolResults');
        const otherResults = localStorage.getItem('otherResults');
        if (savedResults) {
          setResults(JSON.parse(savedResults));
        }
        if (otherResults) {
          setOtherResults(JSON.parse(otherResults));
        }
      } catch (error) {
        console.error("Error loading data: ", error);
      }
    };
    fetchData();
    setMounted(true)
  }, []);

  useEffect(() => {
    if (otherResults) {
      mergeResults(otherResults);
    }
  }, [otherResults])

  useEffect(() => {
    if (socket && isConnected && patrol) {
      console.log("Connected to socket!");
      socket.emit('join_room', patrol.id);
      socket.on('patrol_result_update', (updatedResults) => {
        localStorage.setItem('otherResults', JSON.stringify(updatedResults));
        const filteredResults = updatedResults.filter(
          (res: any) => res.inspectorId !== profile?.id
        );
        setOtherResults(filteredResults);
        localStorage.getItem('otherResults');

        const combinedResults = [...results, ...filteredResults];

        combinedResults.forEach((updatedResult: PatrolResult) => {
          const existingIndex = combinedResults.findIndex(
            (result) =>
              result.itemId === updatedResult.itemId &&
              result.zoneId === updatedResult.zoneId
          );
          if (existingIndex !== -1) {
            combinedResults[existingIndex] = { ...combinedResults[existingIndex], ...updatedResult };
          } else {
            combinedResults.push(updatedResult);
          }
        });

        console.log("combined", combinedResults);
        mergeResults(combinedResults);
      });

      return () => {
        socket.off("patrol_result_update");
      };
    }
  }, [socket, isConnected, results]);

  useEffect(() => {
    if (socket && isConnected && results.length > 0 && patrol) {
      console.log("Emitting result update:", results);
      socket.emit('patrol_result_update', results, patrol.id);
      localStorage.setItem('patrolResults', JSON.stringify(results));
    }
  }, [results, socket, isConnected]);


  console.log("patrol: ", patrol)
  console.log("result: ", results)
  if (!patrol || !mounted) {
    return (
      <div>
        <p>Loading ...</p>
      </div>
    );
  }
  return (
    <div className="p-4">
      <SocketIndicator>

      </SocketIndicator>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center p-0 justify-center text-center gap-2">
            <Button variant="ghost" className="flex hover:bg-secondary w-[40px] h-[40px]">
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
              let iconName: string;
              let status: string;
              let variant:
                | "green"
                | "red"
                | "yellow"
                | "blue"
                | "default"
                | "purple"
                | "secondary"
                | "mint"
                | "orange"
                | "cyan"
                | undefined;
              switch (patrol.status as patrolStatus) {
                case "completed":
                  iconName = "check";
                  variant = "green";
                  status = patrol.status;
                  break;
                case "on_going":
                  iconName = "cached";
                  variant = "purple";
                  status = patrol.status;
                  break;
                case "scheduled":
                  iconName = "event_available";
                  variant = "yellow";
                  status = patrol.status;
                  break;
                default:
                  iconName = "hourglass_top";
                  variant = "blue";
                  status = patrol.status;
                  break;
              }
              return (
                <BadgeCustom
                  iconName={iconName}
                  showIcon={true}
                  showTime={false}
                  variant={variant}
                >
                  {s(status)}
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
                <Button variant={"secondary"} onClick={() => router.back()}>
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
                        exportData(patrol);
                      };
                      break;
                    case "on_going":
                      variant = "primary";
                      iconName = "lock";
                      text = "";
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
                      {patrol.status === 'on_going' ? (
                        allChecked ? (
                          <Button variant={"secondary"} disabled={true} onClick={handleFinishPatrol}>
                            <span className="material-symbols-outlined">lock</span>
                            {t("Finish")}
                          </Button>
                        ) : (
                          <Button variant={ lock ? 'secondary' : variant} disabled={disabled} onClick={toggleLock}>
                            <span className="material-symbols-outlined">{lock ? "lock_open" : iconName }</span>
                            {lock ? t('Unlock') : t('Lock')}
                          </Button>
                        )
                      ) : null}
                    </div>
                  );
                })()}
              </div>
            </div>
            <TabsContent value="detail">
              <div className="py-2">
                {patrol.checklist.map((c: Checklist) => (
                  <div className="mb-4">
                    {profile?.profile.name === c.inspector.name ? (
                      <PatrolChecklist
                        handleResult={handleResult}
                        results={results}
                        checklist={c}
                        disabled={patrol.status === "on_going" && !lock ? false : true} 
                        patrolResult={patrol.result}
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
                {patrol.result.map((result: any) => {
                  if (result.defect.length > 0) {
                    const defect = result.defect[0];

                    const date = new Date(defect.timestamp).toLocaleDateString(
                      "th-TH",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    );

                    const time = new Date(defect.timestamp).toLocaleTimeString(
                      "th-TH",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                      }
                    );
                    console.log("defect log:", defect);
                    return (
                      <div className="py-2">
                        <ReportDefect
                          date={date}
                          title={defect.name}
                          time={time}
                          status={defect.status}
                          beforeImage={defect.imageByInspector}
                          afterImage={defect.imageBySupervisor}
                          type={defect.type}
                          description={defect.description}
                          zone={result.zoneId}
                        />
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
