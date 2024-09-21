import { CreatePatrolCard, PatrolCard } from "@/components/ui/card";

enum patrolStatus {
  scheduled = "Scheduled",
  onGoing = "On Going",
  completed = "Completed",
}

export default function Home() {
  return (
    <div className="flex space-x-5 m-10">
      <CreatePatrolCard />
      <PatrolCard 
        patrolStatus={ patrolStatus.scheduled }
        patrolDate={ new Date('2024-06-21') } 
        patrolTitle="General Inspection" 
        patrolPreset="P08001"  
        patrolorName="John Doe" 
        patrolAllItems={ 0 }
        patrolAllComments={ 0 }
        patrolAllDefects={ 0 }
      />
      <PatrolCard 
        patrolStatus={ patrolStatus.onGoing }
        patrolDate={ new Date('2024-05-16') } 
        patrolTitle="General Inspection" 
        patrolPreset="P08001"  
        patrolorName="John Doe" 
        patrolAllItems={ 3 }
        patrolAllComments={ 1 }
        patrolAllDefects={ 0 }
      />
      <PatrolCard 
        patrolStatus={ patrolStatus.completed }
        patrolDate={ new Date('2024-04-19') } 
        patrolTitle="General Inspection" 
        patrolPreset="P08001"  
        patrolorName="John Doe" 
        patrolAllItems={ 10 }
        patrolAllComments={ 1 }
        patrolAllDefects={ 3 }
      />
    </div>
  );
}
