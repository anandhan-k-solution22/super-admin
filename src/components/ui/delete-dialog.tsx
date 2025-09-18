"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  itemName?: string
  itemType?: string
  isLoading?: boolean
  confirmButtonText?: string
  cancelButtonText?: string
}

export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  description,
  itemName,
  itemType = "item",
  isLoading = false,
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel"
}: DeleteDialogProps) {
  const defaultDescription = `Are you sure you want to delete ${itemName ? `"${itemName}"` : `this ${itemType}`}? This action cannot be undone and will permanently remove the ${itemType} from your system.`

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-black-600">{title}</DialogTitle>
          <DialogDescription className="text-slate-600">
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="min-w-[80px]"
          >
            {cancelButtonText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 text-white hover:bg-red-700 min-w-[80px] disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : confirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
