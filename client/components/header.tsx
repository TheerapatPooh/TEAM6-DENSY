import React from 'react'
import logo from "../app/img/system logo light.png" ;
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white-100 flex justify-between items-center p-4 shadow-md">
    
        <Image
          className="flex items-center"
          src= {logo} 
          alt="Next.js logo"
          width={130}
          height={112}
          priority
        />
      </header>
  )
}
