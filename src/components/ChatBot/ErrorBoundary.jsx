import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    // Bisa log error ke service eksternal di sini
    console.error(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 24,
            color: "#b00020",
            background: "#fff3f3",
            borderRadius: 12,
          }}
        >
          <h3>Oops, something went wrong.</h3>
          <pre style={{ fontSize: 12, color: "#b00020" }}>
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
