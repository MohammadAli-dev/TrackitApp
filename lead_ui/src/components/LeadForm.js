import React, { useState } from "react";

const LeadForm = ({ onAddLead }) => {
  const [formData, setFormData] = useState({
    businessName: "",
    contactPerson: "",
    phone: "",
    address: "",
    location: "",
    comments: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddLead(formData);
    setFormData({ businessName: "", contactPerson: "", phone: "", address: "", location: "", comments: "" });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px", display: "grid", gap: "10px", maxWidth: "400px" }}>
      <input type="text" name="businessName" placeholder="Business Name" value={formData.businessName} onChange={handleChange} required />
      <input type="text" name="contactPerson" placeholder="Contact Person" value={formData.contactPerson} onChange={handleChange} required />
      <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
      <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
      <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
      <input type="text" name="comments" placeholder="Comments" value={formData.comments} onChange={handleChange} />
      <button type="submit">Add Entry</button>
    </form>
  );
};

export default LeadForm;
