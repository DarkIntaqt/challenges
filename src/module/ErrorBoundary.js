import { Component } from "react";

class ErrorBoundary extends Component {
   constructor(props) {
      super(props);
      this.state = {
         hasError: false,
         error: "",
         errorInfo: ""
      };
   }

   static getDerivedStateFromError() {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
   }

   componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      console.warn(error);
      console.warn(errorInfo);
      this.setState({
         error: error.toString(),
         errorInfo: JSON.stringify(errorInfo)
      })
   }

   render() {
      if (this.state.hasError) {
         // You can render any custom fallback UI
         return <div style={{ padding: "20px", backgroundColor: "white" }} >
            <h1>An error occurred</h1>
            <p><b>Feel free to report the following error on <a href="https://github.com/DarkIntaqt/challenges/issues" target="_blank" rel="noreferrer">github.com/DarkIntaqt/challenges</a> by taking a screenshot or copying the following text</b></p>
            <br />
            <br />
            <code style={{
               padding: "10px",
               backgroundColor: "var(--light2)",
               float: "left"
            }}>
               <pre>
                  <p>Source: {window.location.href}</p>
                  <p>{this.state.error}</p>
                  <br />
                  <p dangerouslySetInnerHTML={{ __html: this.state.errorInfo.replace(/\\n/g, "<br/>") }}></p>
               </pre>
            </code>
         </div>;
      }

      return this.props.children;
   }
}


export default ErrorBoundary;