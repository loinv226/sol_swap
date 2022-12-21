import React, { ErrorInfo } from "react";
import ErrorSection from "./error_section";

export class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
    console.log("{ErrorBoundary.getDerivedStateFromError} error: ", error);
    // Update state so the next render will show the fallback UI.
    return { error: error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.log("{ErrorBoundary.componentDidCatch} error: ", error, errorInfo);
  }

  render() {
    // @ts-ignore
    if (this.state.error) {
      // You can render any custom fallback UI
      return <ErrorSection code="APP_EXCEPTION" message="" />;
    }
    // @ts-ignore
    return this.props.children;
  }
}
