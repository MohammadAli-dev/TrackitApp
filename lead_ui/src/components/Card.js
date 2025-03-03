import React from "react";

const Card = ({ children }) => {
  return (
    <div style={{ 
      padding: "15px", 
      border: "1px solid #ccc", 
      borderRadius: "8px", 
      boxShadow: "2px 2px 10px rgba(0,0,0,0.1)" 
    }}>
      {children}
    </div>
  );
};

export default Card;
