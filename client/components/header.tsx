import React from 'react'
import logo from "../app/img/system logo light.png" ;
import Image from 'next/image';

import ProfileDropdown from './profile-dropdown';
import LanguageSelect from '@/components/language-select';
import ModeToggle from '@/components/mode-toggle';
import { CreatePatrolCard, PatrolCard } from '@/components/patrol-card';
import {useTranslations} from 'next-intl';




export default function Header() {
  return (
    <header className="bg-white-100 flex justify-between items-center p-4 shadow-md">
    <div className="flex items-center">
        <Image
          className="flex items-center"
          src= {logo} 
          alt="Next.js logo"
          width={130}
          height={112}
          priority
          />
          </div>

          <div className="flex items-center space-x-4">
          <LanguageSelect/>
        <ModeToggle/>
        <ProfileDropdown/>
            
              
          
          
       
      </div>
      </header>
  )
}
