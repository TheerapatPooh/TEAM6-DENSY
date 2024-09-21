import LanguageSelect from '@/components/language-select';
import ModeToggle from '@/components/mode-toggle';
import { CreatePatrolCard, PatrolCard } from '@/components/patrol-card';
import {useTranslations} from 'next-intl';
import ProfileDropdown from '../../components/profile-dropdown';
 
enum patrolStatus {
  scheduled = "Scheduled",
  onGoing = "On Going",
  completed = "Completed",
}

export default function HomePage() {
  const t = useTranslations('PatrolPage');
  return (
    <div>
      <ModeToggle />
      <LanguageSelect />
      <ProfileDropdown/>
      <h1>{t('greeting')}</h1>
      <div className="flex p-2 gap-4">
      <CreatePatrolCard />
      <PatrolCard 
        patrolStatus= { patrolStatus.scheduled }
        patrolDate={ new Date('2024-06-21') } 
        patrolTitle="General Inspection" 
        patrolPreset="P08001"  
        patrolorName="John Doe" 
        patrolAllItems={ 0 }
        patrolAllComments={ 0 }
        patrolAllDefects={ 0 }
      />
       <PatrolCard 
        patrolStatus= { patrolStatus.onGoing }
        patrolDate={ new Date('2024-05-20') } 
        patrolTitle="General Inspection" 
        patrolPreset="P08001"  
        patrolorName="John Doe" 
        patrolAllItems={ 3 }
        patrolAllComments={ 1 }
        patrolAllDefects={ 0 }
      />
       <PatrolCard 
        patrolStatus= { patrolStatus.completed } 
        patrolDate={ new Date('2024-04-21') } 
        patrolTitle="General Inspection" 
        patrolPreset="P08001"  
        patrolorName="John Doe" 
        patrolAllItems={ 15 }
        patrolAllComments={ 2 }
        patrolAllDefects={ 3 }
      />
      </div>
    </div>
  );
}