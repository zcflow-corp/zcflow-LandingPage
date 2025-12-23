'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

function Dialog(props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger(props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal(props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose(props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

/* ================= OVERLAY ================= */

function DialogOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        `
        fixed inset-0 z-50
        bg-[var(--c-black)]/60
        backdrop-blur-sm
        data-[state=open]:animate-in
        data-[state=closed]:animate-out
        data-[state=open]:fade-in-0
        data-[state=closed]:fade-out-0
        `,
        className
      )}
      {...props}
    />
  )
}

/* ================= CONTENT ================= */

function DialogContent({ className, children, showCloseButton = true, ...props }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          `
          fixed left-1/2 top-1/2 z-50
          w-full max-w-lg
          -translate-x-1/2 -translate-y-1/2
          rounded-[var(--radius)]
          bg-[var(--c-panel)]
          p-6
          text-[var(--c-text)]
          shadow-[var(--shadowXL)]
          outline-none
          data-[state=open]:animate-in
          data-[state=closed]:animate-out
          data-[state=open]:zoom-in-95
          data-[state=closed]:zoom-out-95
          `,
          className
        )}
        {...props}
      >
        {children}

        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="
              absolute right-4 top-4
              rounded-sm
              opacity-70
              transition-opacity
              hover:opacity-100
              focus:outline-none
              text-[var(--c-text)]
            "
          >
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

/* ================= HEADER / FOOTER ================= */

function DialogHeader({ className, ...props }) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  )
}

/* ================= TITLE / DESCRIPTION ================= */

function DialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('font-[var(--font-head)] text-[var(--h3)] leading-none', className)}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-sm text-[var(--c-text-muted)]', className)}
      {...props}
    />
  )
}

/* ================= EXPORTS ================= */

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
