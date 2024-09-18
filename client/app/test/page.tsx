import ModeToggle from '@/components/mode-toggle'
import React from 'react'

export default function page() {
  return (
    <div>
      <div className='w-screen flex bg-foreground shadow-lg'>
        <ModeToggle>
        </ModeToggle>
      </div>
      <div className='bg-secondary h-screen'>

      </div>

    </div>
  )
}
