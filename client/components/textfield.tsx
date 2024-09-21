import React from 'react';

interface TextfieldProps {
  placeholder?: string;  
  iconName?: string;     
  showIcon?: boolean;    
}

export default function Textfield({ placeholder, iconName, showIcon = false }: TextfieldProps) {
  return (
    <div className="flex items-center bg-secondary p-2 rounded-md" >
      {showIcon && iconName && (
        <span className="material-symbols-outlined mr-2 text-input">
          {iconName}
        </span>
      )}
      <input 
        type="text"
        placeholder={placeholder}
        className="bg-transparent outline-none flex-1 text-gray-700 placeholder-gray-400"
      />
    </div>
  );
}
