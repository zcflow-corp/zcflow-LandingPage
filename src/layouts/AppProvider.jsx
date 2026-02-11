'use client'
import { Toaster } from 'sonner'

export default function AppProvider({ children }) {
  return (
    <>
      {children}
      <Toaster richColors position="top-right" />
    </>
  )
}
