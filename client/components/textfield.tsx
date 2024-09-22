import React from 'react';
import { Input } from './ui/input';

interface TextfieldProps {
  placeholder?: string;  
  iconName?: string;     
  showIcon?: boolean;    
}

export default function Textfield({ placeholder, iconName, showIcon = false }: TextfieldProps) {
  return (
    <div className="relative flex items-center" >
      <Input 
        type="text"
        placeholder={placeholder}
        className="ps-10 outline-none border-none bg-card flex-1 text-card-foreground text-base placeholder-gray-400"/>
          {showIcon && iconName && (
          <span
            className={`material-symbols-outlined absolute left-2 text-input transition-opacity duration-300 ${showIcon ? 'opacity-100' : 'opacity-0'}`}
            style={{ visibility: showIcon ? 'visible' : 'hidden' }}
          >
          {iconName}
        </span>
      )}
    </div>
  );
}
