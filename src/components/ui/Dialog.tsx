import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  trigger?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

const maxWidthMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  trigger,
  maxWidth = 'md',
}) => {
  return (
    <RadixDialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {trigger && <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>}

      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-[#0A0A0A]/70 backdrop-blur-xs animate-in fade-in duration-200 motion-reduce:animate-none" />

        <RadixDialog.Content
          className={`fixed left-1/2 top-1/2 z-50 w-[92vw] ${maxWidthMap[maxWidth]} -translate-x-1/2 -translate-y-1/2 bg-[var(--surface,#FFFFFF)] dark:bg-[#141513] text-[var(--ink,#0A0A0A)] dark:text-[#F3F1EA] border border-[#D8D4C8] dark:border-[#2A2C28] rounded-[6px] shadow-xl p-6 focus:outline-hidden animate-in zoom-in-95 duration-200 motion-reduce:animate-none max-h-[90vh] flex flex-col justify-between overflow-y-auto`}
        >
          <div className="space-y-4 text-left">
            <div className="flex items-start justify-between gap-4 border-b border-[#D8D4C8] dark:border-[#2A2C28] pb-3">
              <div className="space-y-1">
                <RadixDialog.Title className="font-['Sora'] text-lg font-bold tracking-tight text-[var(--color-text-primary,#0A0A0A)] dark:text-[#F3F1EA]">
                  {title}
                </RadixDialog.Title>
                {description && (
                  <RadixDialog.Description className="text-xs text-[#5C5E58] dark:text-[#A8AAA3]">
                    {description}
                  </RadixDialog.Description>
                )}
              </div>

              <RadixDialog.Close
                aria-label="Close dialog"
                className="p-1 rounded-[4px] text-[#A8AAA3] hover:text-[#0A0A0A] dark:hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-[#4B78FF]"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </RadixDialog.Close>
            </div>

            <div className="py-2 leading-relaxed text-sm">{children}</div>
          </div>

          {footer && (
            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#D8D4C8] dark:border-[#2A2C28] pt-4 mt-6">
              {footer}
            </div>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};
