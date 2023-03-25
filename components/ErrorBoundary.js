import { Component } from "react";
import ErrorPage from "./ErrorPage";

class ErrorBoundary extends Component {
   constructor(props) {
      super(props);
      this.state = { hasError: false };
   }
   static getDerivedStateFromError(error) {
      return { hasError: true };
   }
   componentDidCatch(error, errorInfo) {
      console.log({ error, errorInfo });
   }
   render() {
      if (this.state.hasError) {
         return <ErrorPage />;
      }

      // Return children components in case of no error

      return this.props.children;
   }
}

export default ErrorBoundary;