import { ArrowLeft, Check, CheckCircle2, Clock, FlaskConical, XCircle } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AvatarTone, ProposalStatus } from '../types';

// Wiederverwendbare, barrierearme UI-Bausteine.

export function Logo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  return (
    <span className={`logo logo-${size}`}>
      <svg className="logo-mark" viewBox="0 0 40 28" aria-hidden="true">
        <circle cx="14" cy="14" r="12" fill="var(--c-mint)" />
        <circle cx="26" cy="14" r="12" fill="var(--c-lavender-light)" fillOpacity="0.9" />
      </svg>
      <span className="logo-text">amivo</span>
    </span>
  );
}

/** Kennzeichnet Demo-Funktionen ehrlich und gut sichtbar. */
export function DemoBadge({ children = 'Demo' }: { children?: ReactNode }) {
  return (
    <span className="badge badge-demo">
      <FlaskConical aria-hidden size={16} />
      {children}
    </span>
  );
}

export function DemoNote({ children, title = 'Hinweis zur Demo' }: { children: ReactNode; title?: string }) {
  return (
    <div className="note note-demo" role="note">
      <FlaskConical aria-hidden size={24} className="note-icon" />
      <div>
        <strong>{title}</strong>
        <div>{children}</div>
      </div>
    </div>
  );
}

export function Note({ icon, title, children, tone = 'info' }: { icon?: ReactNode; title?: string; children: ReactNode; tone?: 'info' | 'safety' | 'success' }) {
  return (
    <div className={`note note-${tone}`} role="note">
      {icon && <span className="note-icon" aria-hidden>{icon}</span>}
      <div>
        {title && <strong>{title}</strong>}
        <div>{children}</div>
      </div>
    </div>
  );
}

export function Avatar({
  name,
  tone,
  photo,
  size = 64,
}: {
  name: string;
  tone: AvatarTone;
  photo?: string;
  size?: number;
}) {
  const initial = (name.trim()[0] ?? '?').toUpperCase();
  if (photo) {
    return <img className="avatar" src={photo} alt="" width={size} height={size} style={{ width: size, height: size }} />;
  }
  return (
    <span
      className={`avatar avatar-${tone}`}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

/** Zurück-Schaltfläche mit Beschriftung und Seitentitel */
export function PageHeader({
  title,
  backTo,
  backLabel = 'Zurück',
  subtitle,
  actions,
}: {
  title: string;
  backTo?: string;
  backLabel?: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <header className="page-header">
      {backTo !== undefined && (
        <button
          type="button"
          className="btn btn-back"
          onClick={() => (backTo === '-1' && window.history.length > 1 ? navigate(-1) : navigate(backTo === '-1' ? '/' : backTo))}
        >
          <ArrowLeft aria-hidden size={24} />
          {backLabel}
        </button>
      )}
      <div className="page-header-row">
        <h1 tabIndex={-1} className="page-title">
          {title}
        </h1>
        {actions}
      </div>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </header>
  );
}

export function ToggleChip({
  pressed,
  onToggle,
  children,
}: {
  pressed: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <button type="button" className="chip" aria-pressed={pressed} onClick={onToggle}>
      {pressed && <Check aria-hidden size={20} strokeWidth={3} />}
      {children}
    </button>
  );
}

const STATUS_META: Record<ProposalStatus, { label: string; icon: ReactNode }> = {
  ausstehend: { label: 'Ausstehend', icon: <Clock aria-hidden size={18} /> },
  angenommen: { label: 'Angenommen', icon: <CheckCircle2 aria-hidden size={18} /> },
  abgelehnt: { label: 'Abgelehnt', icon: <XCircle aria-hidden size={18} /> },
};

/** Status immer mit Symbol UND Text – nie nur über Farbe */
export function StatusBadge({ status }: { status: ProposalStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={`badge badge-status-${status}`}>
      {meta.icon}
      Status: {meta.label}
    </span>
  );
}

export function EmptyState({ icon, title, children, action }: { icon: ReactNode; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="empty-state">
      <span className="empty-icon" aria-hidden>
        {icon}
      </span>
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

export function Spinner({ label = 'Wird geladen …' }: { label?: string }) {
  return (
    <div className="spinner-wrap" role="status">
      <span className="spinner" aria-hidden />
      <span>{label}</span>
    </div>
  );
}

/** Modaler Dialog auf Basis des nativen <dialog>-Elements (Fokusfalle und Escape inklusive). */
export function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="dialog-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {open && (
        <div className="dialog-body">
          <h2 id="dialog-title">{title}</h2>
          <div className="dialog-content">{children}</div>
          <div className="dialog-footer">
            {footer ?? (
              <button type="button" className="btn btn-primary btn-block" onClick={onClose}>
                Schließen
              </button>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}

export function Field({
  label,
  hint,
  error,
  htmlFor,
  optional,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`field${error ? ' field-error' : ''}`}>
      <label htmlFor={htmlFor} className="field-label">
        {label}
        {optional && <span className="field-optional"> (freiwillig)</span>}
      </label>
      {hint && (
        <p className="field-hint" id={`${htmlFor}-hint`}>
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p className="field-error-text" id={`${htmlFor}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="section-title">
      <h2>{children}</h2>
      {action}
    </div>
  );
}
