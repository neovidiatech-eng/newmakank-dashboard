import { toast } from 'sonner';

// Define ToastOptions type locally since it's not exported by 'sonner'
export type ToastOptions = {
    duration?: number;
    closeButton?: boolean;
    style?: React.CSSProperties;
    [key: string]: any;
};

// Default toast options
const defaultOptions: ToastOptions = {
    duration: 4000,
    closeButton: true,
    style: {
        minWidth: '300px',
        color: 'var(--text)',
        backgroundColor: 'var(--background)',
    },
};

// Custom toast functions with consistent styling
export const toaster = {
    success: (message: string, opts?: ToastOptions) => {
        toast.success(message, { ...defaultOptions, ...opts });
    },
    error: (message: string, opts?: ToastOptions) => {
        toast.error(message, { ...defaultOptions, ...opts });
    },
    warning: (message: string, opts?: ToastOptions) => {
        toast.warning(message, { ...defaultOptions, ...opts });
    },
    info: (message: string, opts?: ToastOptions) => {
        toast.info(message, { ...defaultOptions, ...opts });
    },
};
