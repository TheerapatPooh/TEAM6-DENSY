'use client'
import { IDefect, patrolStatus } from '@/app/type';
import BadgeCustom from '@/components/badge-custom';
import Loading from '@/components/loading';
import ReportDefect from '@/components/report-defect';
import TabMenu from '@/components/tab-menu';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { usePatrol } from '@/context/patrol-context';
import { exportData, getPatrolStatusVariant } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'

export default function Page() {
  const {
    patrol,
    patrolResults,
    lock,
    mounted,
    defects,
    canFinish,
    toggleLock,
    calculateProgress,
    handleStartPatrol,
    fetchRealtimeData,
    handleFinishPatrol
  } = usePatrol();
  const locale = useLocale()
  const params = useParams();
  const id = params.id
  const router = useRouter();
  const t = useTranslations("General");
  const s = useTranslations("Status");

  if (!patrol || !mounted) {
    return (
      <Loading />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* TabList และ Title */}
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
        <BadgeCustom
          iconName={getPatrolStatusVariant(patrol.status).iconName}
          showIcon={true}
          showTime={false}
          variant={getPatrolStatusVariant(patrol.status).variant}
        >
          {s(patrol.status)}
        </BadgeCustom>
      </div>
      <div className="flex w-full justify-between items-center">
        <TabMenu id={id.toString()} />
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

      {defects.map((defect: IDefect) => {
        return (
          <div className="">
            <ReportDefect
              defect={defect}
              page={"patrol-view-report"}
              response={(defect: IDefect) => {
                fetchRealtimeData(defect, "edit");
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
