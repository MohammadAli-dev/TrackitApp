import React, { useEffect, useState } from "react";
import Card from "./components/Card";
import CardContent from "./components/CardContent";
import axios from "axios";
import BaseURL from "./config";

const App = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const REACT_NATIVE_NODE_ENVIRONMENT = "development";

  // Updated state: using camelCase keys
  const [formData, setFormData] = useState({
    businessName: "",
    contactPerson: "",
    phone: "",
    address: "",
    location: "",
    comments: ""
  });

  // Fetch existing leads from backend
  const getHandler = async () => {
    try {
      const resp = await axios.get(
        `${BaseURL[REACT_NATIVE_NODE_ENVIRONMENT].authServer}get-leads`
      );
      setData(resp.data);
    } catch (exception) {
      console.log(exception);
    }
  };

  // Post a new lead; now payload uses camelCase keys
  const postHandler = async (e) => {
    e.preventDefault();
    const payload = JSON.stringify(formData);
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BaseURL[REACT_NATIVE_NODE_ENVIRONMENT].authServer}add-lead`,
      headers: { "Content-Type": "application/json" },
      data: payload
    };

    try {
      await axios.request(config);
      // Append the new lead locally (add a date field for display)
      setData([...data, { ...formData, date: new Date().toLocaleString() }]);
      // Reset form values
      setFormData({
        businessName: "",
        contactPerson: "",
        phone: "",
        address: "",
        location: "",
        comments: ""
      });
      setShowForm(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getHandler();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={() => setShowForm(!showForm)}
        style={{ marginBottom: "20px", padding: "10px", fontSize: "16px" }}
      >
        {showForm ? "Hide Form" : "Add New Lead"}
      </button>

      {showForm && (
        <form
          onSubmit={postHandler}
          style={{
            marginBottom: "20px",
            display: "grid",
            gap: "10px",
            maxWidth: "400px"
          }}
        >
          <input
            type="text"
            name="businessName"
            placeholder="Business Name"
            value={formData.businessName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="contactPerson"
            placeholder="Contact Person"
            value={formData.contactPerson}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="comments"
            placeholder="Comments"
            value={formData.comments}
            onChange={handleChange}
          />
          <button type="submit">Add Entry</button>
        </form>
      )}

      <div
        style={{
          padding: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px"
        }}
      >
        {data.map((lead, index) => (
          <Card key={index}>
            <CardContent
              title={lead.businessName || lead.BusinessName}
              details={[
                { label: "Contact", value: lead.contactPerson || lead.ContactPerson },
                { label: "Phone", value: lead.phone || lead.Phone },
                { label: "Address", value: lead.address || lead.Address },
                { label: "Location", value: lead.location || lead.Location },
                { label: "Comments", value: lead.comments || lead.Comments },
                { label: "Date", value: lead.date || lead.Date }
              ]}
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default App;
