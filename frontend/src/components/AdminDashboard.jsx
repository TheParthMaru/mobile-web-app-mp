import React, { useState, useEffect } from "react";

function AdminDashboard() {
  const [threshold, setThreshold] = useState("");
  const [petitions, setPetitions] = useState([]);
  const [response, setResponse] = useState("");

  // Fetch petitions data from the backend
  useEffect(() => {
    const fetchPetitions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/petitions");
        const data = await response.json();
        setPetitions(data.petitions);
      } catch (error) {
        console.error("Error fetching petitions:", error);
      }
    };

    fetchPetitions();
  }, []);

  // Update threshold value
  const handleThresholdChange = (e) => {
    setThreshold(e.target.value);
  };

  // Submit new signature threshold
  const handleSetThreshold = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/setThreshold", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ threshold }),
      });
      const data = await response.json();
      console.log(data);
      alert("Threshold set successfully!");
    } catch (error) {
      console.error("Error setting threshold:", error);
    }
  };

  // Handle petition response submission
  const handleRespondToPetition = async (petitionId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/respond/${petitionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ response }),
        }
      );
      const data = await response.json();
      console.log(data);
      alert("Response submitted and petition closed!");
    } catch (error) {
      console.error("Error responding to petition:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Petitions Committee Dashboard</h1>

      {/* Set signature threshold */}
      <div className="threshold-setting">
        <h2>Set Signature Threshold</h2>
        <form onSubmit={handleSetThreshold}>
          <input
            type="number"
            value={threshold}
            onChange={handleThresholdChange}
            placeholder="Enter signature threshold"
            required
          />
          <button type="submit">Set Threshold</button>
        </form>
      </div>

      {/* Petitions List */}
      <div className="petitions-list">
        <h2>Petitions List</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Signatures</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {petitions.map((petition) => (
              <tr key={petition.id}>
                <td>{petition.title}</td>
                <td>{petition.status}</td>
                <td>{petition.signatures}</td>
                <td>
                  {petition.status === "open" && petition.signatures >= threshold && (
                    <div>
                      <textarea
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        placeholder="Write response"
                      />
                      <button
                        onClick={() => handleRespondToPetition(petition.id)}
                      >
                        Submit Response
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
