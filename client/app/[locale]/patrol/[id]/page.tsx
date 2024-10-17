'use client'

import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fetchData } from '@/lib/api';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import BadgeCustom from '@/components/badge-custom';
import { Checklist, Patrol, patrolStatus } from '@/app/type';
import Defect from '@/components/defect';
import PatrolChecklist from '@/components/patrol-checklist';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams, useRouter } from 'next/navigation';
import { exportData } from '@/lib/utils';
import { useTranslations } from 'next-intl';


// const defectSchema = z.object({
//   title: z.string(),
//   note: z.string(),
//   type: z.string(),
//   status: z.string(),
//   users_id: z.number(),
// });

// const DefectForm = ({ item }: { item: Item }) => {
//   const defectForm = useForm<z.infer<typeof defectSchema>>({
//     resolver: zodResolver(defectSchema),
//     defaultValues: {
//       title: "safety",
//       note: "safety",
//       type: "safety",
//       status: "Reported",
//       users_id: 1,
//     },
//   });

//   const onSubmitDefect = async (values: z.infer<typeof defectSchema>) => {
//     try {
//       // const result = await createDefect(values);
//       // console.log("Defect created successfully for item:", item.id, result);
//     } catch (error) {
//       console.error("Failed to create defect:", error);
//     }
//   };

//   return (
//     <Form {...defectForm}>
//       <form onSubmit={}>
//         <FormField
//           control={}
//           name="title"
//           render={({ field }) => (
//             <FormItem>
//               <FormControl>
//                 <Input {...field} placeholder="Enter title" />
//               </FormControl>
//             </FormItem>
//           )}
//         />
//         <Button type="submit">Submit</Button>
//       </form>
//     </Form>
//   );
// };


export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [patrol, setPatrol] = useState<Patrol | null>(null);
  const [results, setResults] = useState<Array<{ itemId: number, zoneId: number, status: boolean }>>([]);
  const params = useParams()
  const router = useRouter();
  const t = useTranslations("General");
  const s = useTranslations("Status");
  const getPatrolData = async () => {
    if (params.id) {
      try {
        const data = await fetchData('get', `/patrol/${params.id}`, true);
        setPatrol(data);
        console.log(data)
      } catch (error) {
        console.error('Failed to fetch patrol data:', error);
      }
    }
  };

  const handleResult = (result: { itemId: number, zoneId: number, status: boolean }) => {
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
    const patrolId = patrol.id
    const data = {
      status: patrol?.status,
      checklist: patrol?.checklist
    }
    try {
      const response = await fetchData('put', `/patrol/${patrolId}/start`, true, data);
      if (response) {
        console.log('Patrol started successfully:', response);
      }
    } catch (error) {
      console.error('Error starting patrol:', error);
    }
    window.location.reload()
  }

  const handleFinishPatrol = async () => {
    if (!patrol) return;

    const updatedResults = results.map((result) => {

      const matchedResult = patrol.result.find(
        (res) =>
          res.itemId === result.itemId && res.zoneId === result.zoneId
      );


      if (matchedResult && result.status !== null) {
        return {
          id: matchedResult.id,
          status: result.status,
        };
      }

      return null;
    })

    const data = {
      status: "on_going",
      checklist: patrol.checklist,
      result: updatedResults,
    };

    if (data.result.length === patrol.result.length) {
      console.log(data)
      try {
        const response = await fetchData("put", `/patrol/${patrol.id}/finish`, true, data);
        if (response) {
          console.log("Patrol finished successfully:", response);
        }
      } catch (error) {
        console.error("Error finishing patrol:", error);
      }
      window.location.reload();
    }
  };

  useEffect(() => {
    getPatrolData()
    setMounted(true);
  }, [])

  if (!patrol || !mounted) {
    return (
      <div>
        <p>Loading ...</p>
      </div>
    )
  }

  console.log("Results: ", results);

  return (
    <div className='p-4'>
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between items-center'>
          <div className='flex align-center p-0 justify-center text-center'>
            <Button size={'icon'} variant='ghost'>
              <span className="material-symbols-outlined text-card-foreground">error</span>
            </Button>
            <p className='text-2xl font-bold'>{patrol.preset.title}</p>
          </div>
          <div>
            {(() => {
              let iconName: string
              let status: string
              let variant: "green" | "red" | "yellow" | "blue" | "default" | "purple" | "secondary" | "mint" | "orange" | "cyan" | undefined;
              switch (patrol.status as patrolStatus) {
                case "completed":
                  iconName = "check";
                  variant = "green";
                  status = patrol.status
                  break;
                case "on_going":
                  iconName = "cached";
                  variant = "purple";
                  status = patrol.status
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
        <div className='flex flex-col p-4 rounded-md bg-card w-full h-full'>
          <Tabs defaultValue="detail">
            <div className='flex w-full justify-between items-center'>
              <TabsList className='bg-secondary p-1 h-fit'>
                <TabsTrigger value="detail">
                  <span className="material-symbols-outlined mr-2">data_info_alert</span>
                  <p className='font-semibold'>{t('Detail')}</p>
                </TabsTrigger>
                <TabsTrigger value="report">
                  <span className="material-symbols-outlined mr-2">Campaign</span>
                  <p className='font-semibold'>{t('Report')}</p>
                </TabsTrigger>
              </TabsList>
              <div className='flex items-center gap-4'>
                <Button variant={'secondary'} onClick={() => router.back()}>
                  {t('Back')}
                </Button>
                {(() => {
                  let iconName: string
                  let text: string
                  let variant: "link" | "default" | "secondary" | "destructive" | "success" | "fail" | "outline" | "ghost" | "primary" | null | undefined
                  let disabled: boolean
                  let handleFunction: any
                  switch (patrol.status as patrolStatus) {
                    case "completed":
                      variant = "outline";
                      iconName = "ios_share";
                      text = 'Export'
                      disabled = false
                      handleFunction = () => {
                        exportData(patrol)
                      };
                      break;
                    case "on_going":
                      variant = "primary";
                      iconName = "check";
                      text = 'Finish'
                      disabled = false
                      handleFunction = () => {
                        handleFinishPatrol()
                      };
                      break;
                    case "scheduled":
                      variant = "primary";
                      iconName = "cached";
                      text = 'Start'
                      disabled = false
                      handleFunction = () => {
                        handleStartPatrol()
                      };
                      break;
                    default:
                      variant = "primary";
                      iconName = "cached";
                      text = 'Start'
                      disabled = true
                      handleFunction = () => {

                      };
                      break;
                  }
                  return (
                    <Button
                      variant={variant}
                      disabled={disabled}
                      onClick={handleFunction}
                    >
                      <span className="material-symbols-outlined">
                        {iconName}
                      </span>
                      {t(`${text}`)}
                    </Button>
                  );
                })()}
              </div>
            </div>
            <TabsContent value="detail">
              <div className='py-2'>
                {patrol.checklist.map((c: Checklist) => (
                  <div className="mb-4">
                    <PatrolChecklist handleResult={handleResult} results={results} checklist={c} disabled={patrol.status === 'on_going' ? false : true}   patrolResult={patrol.result} />
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="report">
              Test Reports.
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div >
  );
}
