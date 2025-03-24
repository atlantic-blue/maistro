import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

// Dialog Root
export const Dialog = DialogPrimitive.Root;

// Dialog Trigger
export const DialogTrigger = DialogPrimitive.Trigger;

// Dialog Portal
export const DialogPortal = DialogPrimitive.Portal;

// Dialog Close
export const DialogClose = DialogPrimitive.Close;

// Dialog Overlay
export const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm ${className || ''}`}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// Dialog Content
export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={`fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg ${className || ''}`}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
        ✕
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

// Dialog Header
export const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`mb-4 flex flex-col space-y-1.5 text-center sm:text-left ${className || ''}`}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

// Dialog Title
export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={`text-lg font-semibold ${className || ''}`}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

// Dialog Description
export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={`text-sm text-gray-500 ${className || ''}`}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// Dialog Footer
export const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`mt-4 flex justify-end space-x-2 ${className || ''}`}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";
