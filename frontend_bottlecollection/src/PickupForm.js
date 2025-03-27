import { useState } from 'react';
import './PickupForm.css';
import bannerImage from "./Assests/images/redeem.png";



function PickupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    address: "",
    bottleType: "",
    weight: "",
    feedback: "",
    disposalPurpose: "",
    pickupDate: "",
  });

  const [redeemPoints, setRedeemPoints] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "weight" && value < 0) {
      alert("Weight must be a positive number.");
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "bottleType" || name === "weight") {
      calculatePoints(name === "weight" ? value : formData.weight, name === "bottleType" ? value : formData.bottleType);
    }
  };

  const calculatePoints = (weight, bottleType) => {
    let pointsPerKg = 0;

    switch (bottleType) {
      case "plastic": pointsPerKg = 2; break;
      case "glass": pointsPerKg = 3; break;
      case "metal": pointsPerKg = 4; break;
      case "other": pointsPerKg = 1; break;
      default: pointsPerKg = 0;
    }

    const totalPoints = weight ? parseFloat(weight) * pointsPerKg : 0;
    setRedeemPoints(totalPoints);
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    const today = new Date().toISOString().split("T")[0];

    if (formData.pickupDate && formData.pickupDate < today) {
      alert("Pickup date must be today or in the future.");
      return;
    }

    const formDataWithPoints = { ...formData, points: redeemPoints };

    fetch('http://localhost:5000/api/bottles', {  // Ensure this is the correct API route
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formDataWithPoints),
    })
    .then((response) => response.json())
    .then((data) => {
      alert(`Form submitted successfully! You earned ${redeemPoints} points.`);
      console.log('Server Response:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('An error occurred while submitting the form.');
    });


    
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="headingPrimary">Plastic Bottle Collection</h1>
        <h2 className="headingSecondary">Plastic Collection Form</h2>

        <form onSubmit={handleSubmit}>
          <table className="table centeredTable">
            <tbody>
              <tr>
                <td><label htmlFor="name">Name</label></td>
                <td><input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required /></td>
              </tr>

              <tr>
                <td><label htmlFor="email">Email</label></td>
                <td><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required /></td>
              </tr>

              <tr>
                <td><label htmlFor="contactNumber">Contact Number</label></td>
                <td><input type="text" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required /></td>
              </tr>

              <tr>
                <td><label htmlFor="address">Address</label></td>
                <td><textarea id="address" name="address" value={formData.address} onChange={handleChange} required /></td>
              </tr>

              <tr>
                <td><label htmlFor="bottleType">Bottle Type</label></td>
                <td>
                  <select id="bottleType" name="bottleType" value={formData.bottleType} onChange={handleChange} required>
                    <option value="">Select Bottle Type</option>
                    <option value="plastic">Plastic</option>
                    <option value="glass">Glass</option>
                    <option value="metal">Metal</option>
                    <option value="other">Other</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td><label htmlFor="weight">Weight (kg)</label></td>
                <td><input type="number" id="weight" name="weight" value={formData.weight} onChange={handleChange} required min="0.1" step="0.1" /></td>
              </tr>

              <tr>
                <td><label htmlFor="feedback">Feedback</label></td>
                <td><textarea id="feedback" name="feedback" value={formData.feedback} onChange={handleChange} /></td>
              </tr>

              <tr>
                <td><label htmlFor="disposalPurpose">Purpose of Disposal</label></td>
                <td>
                  <select id="disposalPurpose" name="disposalPurpose" value={formData.disposalPurpose} onChange={handleChange} required>
                    <option value="">Select Purpose</option>
                    <option value="recycle">Recycle</option>
                    <option value="dispose">Dispose</option>
                    <option value="reuse">Reuse</option>
                    <option value="other">Other</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td><label htmlFor="pickupDate">Preferred Pickup Date</label></td>
                <td><input type="date" id="pickupDate" name="pickupDate" value={formData.pickupDate} onChange={handleChange} required /></td>
              </tr>

              <tr>
                <td colSpan="2"><button className="submitButton" type="submit">Submit</button>
                <button 
                  className="viewDetailsButton" 
                  type="button" 
                  style={{ marginLeft: "10px" }} 
                  onClick={() => alert(JSON.stringify(formData, null, 2))}
                >
                  View Details
                </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>

        <div className="redeem-points-container">
          <h3>Total Redeem Points: {redeemPoints}</h3>
        </div>

       
          <img src={bannerImage} alt="Reward Program Banner" className="reward-banner" />
          
      </header>
    </div>
  );
}

export default PickupForm;
