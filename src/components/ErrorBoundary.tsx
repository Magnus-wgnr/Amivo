import { Component, type ReactNode } from 'react';

interface State {
  hasError: boolean;
}

/** Fängt unerwartete Fehler ab und zeigt eine verständliche Meldung statt einer leeren Seite. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('AMIVO-Fehler:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-screen" role="alert">
          <h1>Da ist leider etwas schiefgelaufen.</h1>
          <p>Das ist nicht deine Schuld. Bitte lade die Seite neu – deine Angaben bleiben erhalten.</p>
          <button type="button" className="btn btn-primary btn-lg" onClick={() => window.location.reload()}>
            Seite neu laden
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
