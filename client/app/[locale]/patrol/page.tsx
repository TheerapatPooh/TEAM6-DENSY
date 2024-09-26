import BadgeCustom from '@/components/badge-custom';
import { CreatePatrolCard, PatrolCard } from '@/components/patrol-card'
import Textfield from '@/components/textfield';
import {useTranslations} from 'next-intl'

 
enum patrolSheetStatus {
  pending = "Pending",
  scheduled = "Scheduled",
  onGoing = "On Going",
  completed = "Completed",
}

export default function HomePage() {
  const t = useTranslations('General')
  return (
    <div className='flex flex-col p-5 gap-y-5'>
      <h1>{t('greeting')}</h1>
      <Textfield iconName='search' showIcon={true} placeholder='Search...'/>
      <div className="flex gap-4">
      <CreatePatrolCard />
      <PatrolCard 
        patrolSheetStatus= { patrolSheetStatus.pending }
        patrolSheetDate={ new Date('2024-06-19') } 
        patrolSheetTitle="General Inspection" 
        presetNumber="P08001"  
        inspectorNames={["John Doe", "Jane Smith"]}
        detectedItems={ 0 }
        detectedComments={ 0 }
        detectedDefects={ 0 }
      />
      <PatrolCard 
        patrolSheetStatus= { patrolSheetStatus.scheduled }
        patrolSheetDate={ new Date('2024-06-21') } 
        patrolSheetTitle="General Inspection" 
        presetNumber="P08001"  
        inspectorNames={["John Doe"]}  
        detectedItems={ 0 }
        detectedComments={ 0 }
        detectedDefects={ 0 }
      />
       <PatrolCard 
        patrolSheetStatus= { patrolSheetStatus.onGoing }
        patrolSheetDate={ new Date('2024-06-21') } 
        patrolSheetTitle="General Inspection" 
        presetNumber="P08001"  
        inspectorNames={["Ethan Blake", "Mia Johnson", "Lucas Harper", "Ava Mitchell", "Noah Carter"]}
        detectedItems={ 3 }
        detectedComments={ 1 }
        detectedDefects={ 0 }
      />
       <PatrolCard 
        patrolSheetStatus= { patrolSheetStatus.completed } 
        patrolSheetDate={ new Date('2024-5-21') } 
        patrolSheetTitle="General Inspection" 
        presetNumber="P08001"  
        inspectorNames={["Ethan Blake", "Mia Johnson", "Lucas Harper", "Ava Mitchell", "Noah Carter", "Sophia Davis", "Liam Thompson"]}
        detectedItems={ 15 }
        detectedComments={ 2 }
        detectedDefects={ 3 }
      />
      </div>
      <BadgeCustom 
        iconName="check_circle" 
        showIcon={true}   
        showTime={true}   
        timeStamp="22:38"
        variant="mint" 
      >
        Hello
      </BadgeCustom>
      <BadgeCustom 
        iconName="check_circle" 
        showIcon={true}   
        showTime={true}   
        timeStamp="22:38"
        variant="blue" 
      >
        Hello
      </BadgeCustom>
      <BadgeCustom 
        iconName="check_circle" 
        showIcon={true}   
  
        variant="yellow" 
      >
        In Progress
      </BadgeCustom>
      <BadgeCustom 
        iconName="check_circle" 
        showIcon={true}   
        showTime={true}   
        timeStamp="22:38"
        variant="red" 
      >
        Hello
      </BadgeCustom>
      <BadgeCustom 
        iconName="check_circle" 
        showIcon={true}   
        showTime={true}   
        timeStamp="22:38"
        variant="orange" 
      >
        Hello
      </BadgeCustom>
      <BadgeCustom 
        iconName="check_circle" 
        showIcon={true}   
        showTime={true}   
        timeStamp="22:38"
        variant="purple" 
      >
        Hello
      </BadgeCustom>
      <BadgeCustom 
        iconName="check_circle" 
        showIcon={true}   
        showTime={true}   
        timeStamp="22:38"
        variant="cyan" 
      >
        Hello
      </BadgeCustom>
      <BadgeCustom 
        iconName="check_circle" 
        showIcon={true}   
        showTime={true}   
        timeStamp="22:38"
        variant="green" 
      >
        Hello
      </BadgeCustom>
      <BadgeCustom 
        iconName="check_circle" 
        showIcon={true}   
        showTime={true}   
        timeStamp="22:38"
        variant="secondary" 
      >
        Hello
      </BadgeCustom>
    </div>
  );
}