import React from 'react'
import ModeToggle from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'

export default function page() {
  return (
    <div>
      <ModeToggle>

      </ModeToggle>
      <Button variant="secondary" className='bg-card'>
        Test
      </Button>
    </div>
  )
}
