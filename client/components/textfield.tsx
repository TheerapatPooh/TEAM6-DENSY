'use client'
import React, { useState } from 'react';
import { Input } from './ui/input'
import { cn } from "@/lib/utils"


interface TextfieldProps {
  placeholder?: string;  
  iconName?: string;  
  type?: string;
  showIcon?: boolean;    
  className?: string; 
}

export default function Textfield({
  placeholder, 
  iconName, 
  showIcon = false,
  type = 'text',
  className  }: TextfieldProps) {
    const [visible, setVisible] = useState(false);
    const toggleVisibility = () => setVisible(!visible);
  return (
    <div className="relative flex items-center w-full" >
      <Input 
        type={type === 'password' ? (visible ? 'text' : 'password') : type}
        placeholder={placeholder}
        className={cn("ps-10 outline-none border-none bg-card flex-1 text-card-foreground text-base placeholder:text-input", className)}/>
          {showIcon && iconName && (
          <span
            className={`material-symbols-outlined absolute left-2 text-input transition-opacity duration-300 ${showIcon ? 'opacity-100' : 'opacity-0'}`}
            style={{ visibility: showIcon ? 'visible' : 'hidden' }}
          >
          {iconName}
        </span>
      )}
        {type === 'password' && (
        <span
          className="material-symbols-outlined absolute right-2 cursor-pointer text-input"
          onClick={toggleVisibility}
        >
          {visible ? 'visibility_off' : 'visibility'}
        </span>
      )}
    </div>
  );
}
