import React from "react";
import NavBar from "./components/NavBar";
import ImageGenerator from "./components/ImageGenerator";
import Chatbot from "./components/ChatBot/ChatBot";
import ErrorBoundary from "./components/ChatBot/ErrorBoundary";

const App = () => {
  return (
    <>
      <ErrorBoundary>
        <NavBar />
        <ImageGenerator />
        <Chatbot />
      </ErrorBoundary>
    </>
  );
};

export default App;
