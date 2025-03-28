import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import MyRoutes from "./Route";

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <MyRoutes />
    </GoogleOAuthProvider>
  );
}

export default App;
