import { CheckCircle2, Info } from 'lucide-react';
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

type Tone = 'success' | 'info';

interface ToastItem {
  id: number;
  text: string;
  tone: Tone;
}

const ToastContext = createContext<(text: string, tone?: Tone) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastItem | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const show = useCallback((text: string, tone: Tone = 'success') => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), text, tone });
    // Längere Anzeigedauer, damit genug Zeit zum Lesen bleibt
    timer.current = window.setTimeout(() => setToast(null), 6000);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {toast && (
          <div key={toast.id} className={`toast toast-${toast.tone}`}>
            {toast.tone === 'success' ? <CheckCircle2 aria-hidden size={26} /> : <Info aria-hidden size={26} />}
            <span>{toast.text}</span>
            <button type="button" className="toast-close" onClick={() => setToast(null)}>
              OK
            </button>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
