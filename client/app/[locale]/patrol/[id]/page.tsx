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

  const getPatrolData = async () => {
    try {
      const data = await fetchData("get", "/patrol/2", true);
      setPatrol(data)
      console.log("data : ", data)
      console.log("patrol", data.checklist)
    } catch (error) {
      console.error('Failed to fetch patrol data:', error);
    }
  };



  useEffect(() => {
    getPatrolData();
  }, [])

  return (
    <div>
      {patrol ? (

        <div>
          <div className='flex justify-between'>
            <div className='flex align-center p-0  border border-indigo-600 justify-center text-center'>
              <Button className="h-[35px] w-[35px]" variant='ghost'>
                <span className="material-symbols-outlined">error</span>
              </Button>
              <p className='text-2xl'>{patrol.preset.title}</p>
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
                    {patrol.status}
                  </BadgeCustom>
                );
              })()}


            </div>
          </div>

          <div className='flex justify-between'>
            <div>
              <button className='border-2 border-indigo-600 gap-5'>details</button>
              <button className='border-2 border-indigo-600 gap-5'>reports</button>
            </div>
            <div>
              <button className='border-2 border-indigo-600 gap-5'>Back</button>
              <button className='border-2 border-indigo-600 gap-5'>Finish</button>
            </div>
          </div>

          <div className="relative">
            {patrol.checklist.map((c: Checklist) => (
              <div className="mb-4">
                <PatrolChecklist key={c.id} checklist={c} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
