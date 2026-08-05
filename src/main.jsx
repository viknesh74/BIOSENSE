import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'monospace', background: '#0f172a', color: '#f87171', minHeight: '100vh' }}>
          <h2 style={{ color: '#fbbf24' }}>⚠️ App Crashed — Check this error:</h2>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', background: '#1e293b', padding: '1rem', borderRadius: '8px', color: '#e2e8f0' }}>
            {this.state.error?.message}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
          <p style={{ color: '#94a3b8', marginTop: '1rem' }}>Send a screenshot of this to your developer!</p>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <AppProvider>
      <App />
    </AppProvider>
  </ErrorBoundary>
)

