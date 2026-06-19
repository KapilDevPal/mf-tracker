import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon } from 'lucide-react';
import { ROUTES } from '@/constants';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0f1e',
            color: '#f9fafb',
            fontFamily: 'system-ui, sans-serif',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div
            className="glass-card"
            style={{
              padding: '2.5rem',
              maxWidth: '500px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              background: 'rgba(239, 68, 68, 0.02)',
              borderRadius: '1rem',
            }}
          >
            <AlertOctagon size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Something went wrong</h2>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>
              An unexpected error occurred in the application: <br />
              <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px', color: '#ef4444', fontSize: '0.8rem', display: 'inline-block', marginTop: '0.5rem' }}>
                {this.state.error?.message || 'Unknown Error'}
              </code>
            </p>
            <button
              onClick={() => {
                window.location.href = '/mf-tracker/';
              }}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                color: 'white',
                border: 'none',
                padding: '0.625rem 1.25rem',
                borderRadius: '0.625rem',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
