import React from 'react';

class SafeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Component Crash Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-rose-50 border-2 border-dashed border-rose-200 rounded-[40px] text-center my-10">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          </div>
          <h2 className="text-xl font-black text-rose-900 mb-2">Something went wrong</h2>
          <p className="text-sm text-rose-700 max-w-md mx-auto mb-6">
            We've encountered a rendering error in this section. Our team has been notified.
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="px-6 py-2 bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all"
          >
            Try Refreshing Section
          </button>
          {this.state.error?.toString()}
        </div>
      );
    }

    return this.props.children; 
  }
}

export default SafeErrorBoundary;
