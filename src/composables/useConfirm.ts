import { ref } from 'vue'

export interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  input?: boolean
  inputLabel?: string
  inputValue?: string
  inputPlaceholder?: string
}

export interface DialogState extends ConfirmOptions {
  isOpen: boolean
  resolve?: (value: boolean | string | null) => void
}

const state = ref<DialogState>({
  isOpen: false,
  message: '',
  title: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  type: 'danger',
  input: false,
  inputValue: '',
})

export const useConfirm = () => {
  const confirm = (optionsOrMessage: string | Omit<ConfirmOptions, 'input'>): Promise<boolean> => {
    return new Promise((resolve) => {
      const options =
        typeof optionsOrMessage === 'string' ? { message: optionsOrMessage } : optionsOrMessage

      state.value = {
        isOpen: true,
        title: options.title || (options.type === 'info' ? 'Confirm Action' : 'Are you sure?'),
        message: options.message,
        confirmText: options.confirmText || (options.type === 'info' ? 'Confirm' : 'Delete'),
        cancelText: options.cancelText || 'Cancel',
        type: options.type || 'danger',
        input: false,
        resolve: (val) => resolve(Boolean(val)),
      }
    })
  }

  const handleConfirm = () => {
    if (state.value.resolve) state.value.resolve(true)
    state.value.isOpen = false
  }

  const handleCancel = () => {
    if (state.value.resolve) state.value.resolve(false)
    state.value.isOpen = false
  }

  return { state, confirm, handleConfirm, handleCancel }
}
