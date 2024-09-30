'use client'

import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createDefect, fetchData } from '@/lib/utils';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BadgeCustom from '@/components/badge-custom';

// Type definitions
interface Patrol {
  id: number
  date: string
  start_time: string
  end_time: string
  duration: string
  status: string
  preset: {
    id: number
    title: string
    description: string
    version: number
    latest: boolean
    updateAt: string
    updateBy: number
    checklists: Checklist[]
  };
}

interface Checklist {
  id: number
  title: string
  version: number
  latest: boolean
  updateAt: string
  updateBy: number
  inspectorId: number
  items: Item[]
}

interface Item {
  id: number
  name: string
  type: string
  checklists_id: number
  zones_id: number
}

interface Patrol_Result {
  id: number
  status: number
  items_id: number
  defects_id: number
  patrols_id: number
}


const defectSchema = z.object({
  title: z.string(),
  note: z.string(),
  type: z.string(),
  status: z.string(),
  users_id: z.number(),
});

// Component for Defect Form
const DefectForm = ({ item }: { item: Item }) => {
  const defectForm = useForm<z.infer<typeof defectSchema>>({
    resolver: zodResolver(defectSchema),
    defaultValues: {
      title: "safety",
      note: "safety",
      type: "safety",
      status: "Reported",
      users_id: 1,
    },
  });

  const onSubmitDefect = async (values: z.infer<typeof defectSchema>) => {
    try {
      const result = await createDefect(values);
      console.log("Defect created successfully for item:", item.id, result);
    } catch (error) {
      console.error("Failed to create defect:", error);
    }
  };

  return (
    <Form {...defectForm}>
      <form onSubmit={defectForm.handleSubmit(onSubmitDefect)}>
        <FormField
          control={defectForm.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Enter title" />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};



export default function Page() {
  const [patrol, setPatrol] = useState<Patrol | null>(null);

  const getPatrolData = async () => {
    try {
      const data = await fetchData('/patrol/2');
      setPatrol(data);
    } catch (error) {
      console.error('Failed to fetch patrol data:', error);
    }
  };

  useEffect(() => {
    getPatrolData();
  }, []);

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

          {patrol.preset.checklists.map((checklist) => (
            <div key={checklist.id}>
              <div className="border-2 border-indigo-555 gap-5">
                <h1 className="font-extrabold text-2">{checklist.title}</h1>
                <p>Inspector {checklist.inspectorId}</p>
              </div>
              <div>
                <ul className="p-5">
                  {checklist.items.map((item) => (
                    <div
                      key={item.id}
                      className="justify-between flex border-double border-4 border-indigo-600 rounded-lg p-2"
                    >
                      <div>
                        <div className="flex gap-x-8">
                          <span className="material-symbols-outlined">error</span>
                          <p>Zone</p>
                          <p>{item.zones_id}</p>
                        </div>
                        <div className="flex gap-x-8">
                          <span className="material-symbols-outlined">error</span>
                          <p>ResponsibleMan</p>
                          <p>Est</p>
                        </div>
                      </div>
                      <div>
                        <button className="gap-x-5 border-double border-4 border-indigo-600" type="button">
                          YES
                        </button>
                        <button className="gap-x-5 border-double border-4 border-indigo-600" type="button">
                          NO
                        </button>
                      </div>
                      <DefectForm item={item} /> {/* Defect form for each item */}
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
