import LanguageSelect from '@/components/language-select';
import ModeToggle from '@/components/mode-toggle';
import {useTranslations} from 'next-intl';
import ProfileDropdown from '../../components/profile-dropdown';
 
export default function HomePage() {
  const t = useTranslations('PatrolPage');
  return (
    <div>
      <ModeToggle />
      <LanguageSelect />
      <ProfileDropdown/>
      <h1>{t('greeting')}</h1>
    </div>
  );
}