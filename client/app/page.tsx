import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardAddExample, CardShowExample } from "@/components/ui/card";

enum patrolStatus {
  Scheduled = "Scheduled",
  OnGoing = "On Going",
  Completed = "Completed",
}
export default function Home() {
  return (
    <div className="flex space-x-5 m-10">
      <CardAddExample />
      <CardShowExample 
        patrolStatus={patrolStatus.Scheduled}
        patrolDate={new Date('2024-06-21')} 
        patrolTitle="General Inspection" 
        patrolPreset="P08001"  
        patrolorName="John Doe" 
      />
    </div>
  );
}
