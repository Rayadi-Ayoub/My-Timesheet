import React from "react";

function AccessDenied() {
  return (
    <div
      style={{
        backgroundImage: "url('/NoAc.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "87.9vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
      }}
    ></div>
  );
}

export default AccessDenied;
