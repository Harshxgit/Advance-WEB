import { useState } from "react";
import "./App.css";
import { Turnstile } from "@marsidev/react-turnstile";
import axios from "axios";
function App() {
  const [token, setToken] = useState("");

  return (
    <>
    {token}
      <input type="password" className="password" />
      <input type="otp" className="otp" />
      <Turnstile
        onSuccess={(token) => {
          setToken(token);
        }}
        siteKey="0x4AAAAAAAwsPtO1RkLb-vFz"
      />
      <button
        onClick={() => {
          axios.post("http://localhost:3000/reset-password", {
            email: "harshit@gmail.com",
            newPassword: "harshit01",
            otp: "145056",
          });
        }}
      >Update password</button>
    </>
  );
}

export default App;
