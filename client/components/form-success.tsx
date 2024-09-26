import React from 'react'

interface FormSuccessProps {
  message?: string
}

export default function FormSuccess({ message, }: FormSuccessProps) {
  if (!message) return null
  return (
    <div className='bg-green-500/20 p-4 rounded-md flex items-center gap-2 text-md text-green-500'>
      <span className="material-symbols-outlined">
        check_circle
      </span>
      <p>{message}</p>
    </div>
  )
}
