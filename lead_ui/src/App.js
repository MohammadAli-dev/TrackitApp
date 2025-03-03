import React, { useEffect, useState } from "react";
import axios from "axios";
import BaseURL from "./config";

const App = () => {
  // State for fetched lead records
  const [data, setData] = useState([]);
  // Toggle for showing/hiding the add lead form
  const [showForm, setShowForm] = useState(false);
  // State for add lead form; using camelCase keys
  const [formData, setFormData] = useState({
    businessName: "",
    contactPerson: "",
    phone: "",
    address: "",
    location: "",
    comments: ""
  });
  // State for filter inputs (one per column)
  const [filters, setFilters] = useState({
    businessName: "",
    contactPerson: "",
    phone: "",
    address: "",
    location: "",
    comments: "",
    date: ""
  });

  // Fetch leads from the backend when component mounts
  const getHandler = async () => {
    try {
      const resp = await axios.get(
        `${BaseURL.development.authServer}get-leads`
      );
      setData(resp.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getHandler();
  }, []);

  // Automatically fetch location when form is shown
  useEffect(() => {
    if (showForm && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prevData) => ({
            ...prevData,
            location: `${latitude},${longitude}`
          }));
        },
        (error) => {
          console.error("Error fetching location: ", error);
        }
      );
    }
  }, [showForm]);

  // Handle changes in the add lead form inputs
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submission of the add lead form
  const postHandler = async (e) => {
    e.preventDefault();
    const payload = JSON.stringify(formData);
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BaseURL.development.authServer}add-lead`,
      headers: { "Content-Type": "application/json" },
      data: payload
    };

    try {
      await axios.request(config);
      // Append new lead locally, adding a date field for display
      setData([...data, { ...formData, date: new Date().toLocaleString() }]);
      // Reset form data
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

  // Handle changes in the filter inputs for the table
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Helper: Given a lead and key, return the value (trying both camelCase and PascalCase)
  const getValue = (lead, key) => {
    return (
      lead[key] ||
      lead[key.charAt(0).toUpperCase() + key.slice(1)] ||
      ""
    ).toString();
  };

  // Filter the data based on each filter input
  const filteredData = data.filter((lead) =>
    Object.keys(filters).every((key) => {
      const filterVal = filters[key].toLowerCase().trim();
      const leadVal = getValue(lead, key).toLowerCase();
      if (!filterVal) return true;
      // Check if the value includes the filter text
      return leadVal.includes(filterVal);
    })
  );

  return (
    <div style={{ padding: "20px" }}>
      {/* Add Lead Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        style={{ marginBottom: "20px", padding: "10px", fontSize: "16px" }}
      >
        {showForm ? "Hide Form" : "Add New Lead"}
      </button>
  
      {/* Add Lead Form */}
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
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="contactPerson"
            placeholder="Contact Person"
            value={formData.contactPerson}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location (lat,long)"
            value={formData.location}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="comments"
            placeholder="Comments"
            value={formData.comments}
            onChange={handleFormChange}
          />
          <button type="submit">Add Entry</button>
        </form>
      )}
  
      {/* Table container with horizontal scrolling */}
      <div style={{ overflowX: "auto", marginTop: "20px" }}>
        <table
          border="1"
          cellPadding="5"
          cellSpacing="0"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Contact Person</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Location</th>
              <th>Comments</th>
              <th>Date</th>
            </tr>
            {/* Filter row */}
            <tr>
              <th>
                <input
                  type="text"
                  name="businessName"
                  value={filters.businessName}
                  onChange={handleFilterChange}
                  placeholder="Filter"
                />
              </th>
              <th>
                <input
                  type="text"
                  name="contactPerson"
                  value={filters.contactPerson}
                  onChange={handleFilterChange}
                  placeholder="Filter"
                />
              </th>
              <th>
                <input
                  type="text"
                  name="phone"
                  value={filters.phone}
                  onChange={handleFilterChange}
                  placeholder="Filter"
                />
              </th>
              <th>
                <input
                  type="text"
                  name="address"
                  value={filters.address}
                  onChange={handleFilterChange}
                  placeholder="Filter"
                />
              </th>
              <th>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="Filter"
                />
              </th>
              <th>
                <input
                  type="text"
                  name="comments"
                  value={filters.comments}
                  onChange={handleFilterChange}
                  placeholder="Filter"
                />
              </th>
              <th>
                <input
                  type="text"
                  name="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                  placeholder="Filter"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((lead, index) => (
              <tr key={index}>
                <td>{getValue(lead, "businessName")}</td>
                <td>{getValue(lead, "contactPerson")}</td>
                <td>{getValue(lead, "phone")}</td>
                <td>{getValue(lead, "address")}</td>
                <td>{getValue(lead, "location")}</td>
                <td>{getValue(lead, "comments")}</td>
                <td>{getValue(lead, "date")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );  
};

export default App;