'use client'

import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fetchData } from '@/lib/api';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BadgeCustom from '@/components/badge-custom';
import { Checklist, Patrol } from '@/app/type';
import Defect from '@/components/defect';
import PatrolChecklist from '@/components/patrol-checklist';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';


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
  const [patrol, setPatrol] = useState<Patrol | null>(null);
  const [results, setResults] = useState<Array<{ itemId: number, zoneId: number, status: boolean }>>([]);

  const getPatrolData = async () => {
    try {
      const data = await fetchData("get", "/patrol/3", true);
      setPatrol(data)
    } catch (error) {
      console.error('Failed to fetch patrol data:', error);
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

  useEffect(() => {
    getPatrolData();
  }, [])

  if (!patrol) {
    return null
  }

  console.log("Results: ", results);

  return (
    <div className='p-4'>
      {patrol ? (

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
                let variant: "green" | "red" | "yellow" | "blue" | "default" | "purple" | "secondary" | "mint" | "orange" | "cyan" | undefined;
                switch (patrol.status) {
                  case "Completed":
                    iconName = "check";
                    variant = "green";
                    break;
                  case "OnGoing":
                    iconName = "cached";
                    variant = "purple";
                    break;
                  case "Scheduled":
                    iconName = "event_available";
                    variant = "yellow";
                    break;
                  default:
                    iconName = "hourglass_top";
                    variant = "blue";
                    break;
                }
                return (
                  <BadgeCustom
                    iconName={iconName}
                    showIcon={true}
                    showTime={false}
                    variant={variant}
                  >
                    {patrol.status.charAt(0).toUpperCase() + patrol.status.slice(1)}
                  </BadgeCustom>
                );
              })()}


            </div>
          </div>

          <div className='flex flex-col p-4 rounded-md bg-card w-full h-full'>
            <Tabs defaultValue="details">
              <TabsList className='bg-secondary p-1 h-fit'>
                <TabsTrigger value="details">
                  <span className="material-symbols-outlined mr-2">data_info_alert</span>
                  <p className='font-semibold'>Details</p>
                </TabsTrigger>
                <TabsTrigger value="reports">
                  <span className="material-symbols-outlined mr-2">Campaign</span>
                  Reports
                </TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <div className='py-2'>
                  {patrol.checklist.map((c: Checklist) => (
                    <div className="mb-4">
                      <PatrolChecklist handleResult={handleResult} results={results} checklist={c} />
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="reports">
                Test Reports.
              </TabsContent>
            </Tabs>


          </div>

        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
