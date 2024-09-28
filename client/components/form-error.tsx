import React from 'react'

interface FormErrorProps {
  message?: string
}

export default function FormError({ message, }: FormErrorProps) {
  if (!message) return null
  return (
    <div
    className='bg-destructive/20 p-4 rounded-md flex items-center gap-2 text-md text-destructive fixed top-4 left-1/2 transform -translate-x-1/2 z-50 shadow-lg'
    style={{ minWidth: '300px' }}
  >      <span className="material-symbols-outlined">
        warning
      </span>
      <p>{message}</p>
    </div>
  )
}
