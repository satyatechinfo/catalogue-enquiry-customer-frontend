import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error', error, info);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="state-view" role="alert" style={{ margin: '4rem auto', maxWidth: 520 }}>
        <h1>Something went wrong</h1>
        <p>Please refresh the page. If the problem continues, contact us via WhatsApp or the enquiry form.</p>
        <button type="button" className="btn btn--primary btn--md" onClick={() => window.location.assign('/')}>Reload the site</button>
      </div>
    );
  }
}
