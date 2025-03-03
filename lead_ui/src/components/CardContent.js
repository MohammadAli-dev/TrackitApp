import React from "react";

const CardContent = ({ title, details }) => {
  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>{title}</h2>
      {details.map((detail, index) => (
        <p key={index}>
          <strong>{detail.label}:</strong> {detail.value}
        </p>
      ))}
    </div>
  );
};

export default CardContent;
