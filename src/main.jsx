import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import LoginApp from "./Login.jsx";
import SignupApp from "./Signup.jsx";
import FindID from "./FindID.jsx";
import FindPassword from "./FindPassword.jsx";
import "./Login.css";
import "./Signup.css";
import "./FindID.css";
import "./FindPassword.css";

function App() {
  const [view, setView] = useState("login");

  if (view === "signup") {
    return <SignupApp onBack={() => setView("login")} />;
  }

  if (view === "findid") {
    return <FindID onBack={() => setView("login")} />;
  }

  if (view === "findpw") {
    return <FindPassword onBack={() => setView("login")} />;
  }

  return (
    <LoginApp
      onSignup={() => setView("signup")}
      onFindId={() => setView("findid")}
      onFindPw={() => setView("findpw")}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
