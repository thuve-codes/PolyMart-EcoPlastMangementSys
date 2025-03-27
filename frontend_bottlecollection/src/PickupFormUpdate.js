import { useState } from 'react';
import headImage from './Assests/images/plastic.jpg';
import './PickupForm.css';
import bannerImage from "./Assests/images/redeem.png";
import sideImage from "./Assests/images/points.jpg";

function PickupFormUpdate() {
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
      case "plastic":
        pointsPerKg = 2;
        break;
      case "glass":
        pointsPerKg = 3;
        break;
      case "metal":
        pointsPerKg = 4;
        break;
      case "other":
        pointsPerKg = 1;
        break;
      default:
        pointsPerKg = 0;
    }

    const totalPoints = weight ? parseFloat(weight) * pointsPerKg : 0;
    setRedeemPoints(totalPoints);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.weight <= 0) {
      alert("Weight must be a positive number.");
      return; // Prevent form submission if weight is invalid
    }
    const formDataWithPoints = { ...formData, points: redeemPoints };

    // Send the data to the backend using fetch
    fetch('http://localhost:4000/submitForm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const formDataWithPoints = { ...formData, points: redeemPoints };

    // Send a PUT request to update the existing data
    fetch('http://localhost:4000/updateForm', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formDataWithPoints),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(`Form updated successfully! You earned ${redeemPoints} points.`);
        console.log('Server Response:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while updating the form.');
      });
  };

  const handleDelete = (e) => {
    e.preventDefault();

    // Send a DELETE request to delete the existing data
    fetch('http://localhost:4000/deleteForm', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: formData.email }), // Assuming email is the unique identifier
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Form deleted successfully.');
        console.log('Server Response:', data);
        // Optionally reset the form or do other cleanup
        setFormData({
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
        setRedeemPoints(0);
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while deleting the form.');
      });
  };

  const [bottleType, setBottleType] = useState("");
  const [weight, setWeight] = useState("");
  const [points, setPoints] = useState(0);

  const pointRates = {
    plastic: 10,
    glass: 8,
    metal: 15,
    other: 5,
  };

  const offers = [
    { id: 1, title: "10% Discount on Recycled Products", pointsRequired: 100 },
    { id: 2, title: "Free Eco-Friendly Tote Bag", pointsRequired: 200 },
    { id: 3, title: "Special Membership Badge", pointsRequired: 300 },
  ];

  const permanentCustomerDeals = [
    { id: 1, title: "Exclusive 25% Discount on Plastic-Free Products" },
    { id: 2, title: "VIP Access to Recycling Events" },
    { id: 3, title: "Priority Collection Service" },
  ];

  const calcPoints = () => {
    if (bottleType && weight) {
      const earnedPoints = weight * (pointRates[bottleType] || 0);
      setPoints((prevPoints) => prevPoints + earnedPoints);
    } else {
      alert("Please select a bottle type and enter weight!");
    }
  };

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
                <td>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </td>
              </tr>

              <tr>
                <td><label htmlFor="email">Email</label></td>
                <td>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </td>
              </tr>

              <tr>
                <td><label htmlFor="contactNumber">Contact Number</label></td>
                <td>
                  <input type="text" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
                </td>
              </tr>

              <tr>
                <td><label htmlFor="address">Address</label></td>
                <td>
                  <textarea id="address" name="address" value={formData.address} onChange={handleChange} required />
                </td>
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
                <td>
                  <input type="number" id="weight" name="weight" value={formData.weight} onChange={handleChange} required />
                </td>
              </tr>

              <tr>
                <td><label htmlFor="feedback">Feedback</label></td>
                <td>
                  <textarea id="feedback" name="feedback" value={formData.feedback} onChange={handleChange} />
                </td>
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
                <td>
                  <input type="date" id="pickupDate" name="pickupDate" value={formData.pickupDate} onChange={handleChange} required />
                </td>
              </tr>

              <tr>
                <td colSpan="2">
                  <button className="submitButton" type="submit">Submit</button>
                  <button className="updateButton" onClick={handleUpdate} type="button">Update</button>
                  <button className="deleteButton" onClick={handleDelete} type="button">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>

        <div className="redeem-points-container">
          <h3>Total Redeem Points: {redeemPoints}</h3>
        </div>
        <div className="reward-container">
          <img src={bannerImage} alt="Reward Program Banner" className="reward-banner" />
          <h1>🎉 Earn Reward Points & Get Exclusive Offers! 🎉</h1>
          <div className="form-group">
            <table className="bottle-selection-table">
              <tbody>
                <tr>
                  <td><label>Select Bottle Type:</label></td>
                  <td>
                    <select value={bottleType} onChange={(e) => setBottleType(e.target.value)}>
                      <option value="">Select</option>
                      <option value="plastic">Plastic</option>
                      <option value="glass">Glass</option>
                      <option value="metal">Metal</option>
                      <option value="other">Other</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td><label>Enter Weight (kg):</label></td>
                  <td>
                    <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button onClick={calcPoints}>Calculate Points</button>
          <h2>⭐ Your Total Reward Points: {points}</h2>

          <h3>🏆 Available Offers:</h3>
          <ul>
            {offers.map((offer) => (
              <li key={offer.id} className={points >= offer.pointsRequired ? "available" : "unavailable"}>
                {offer.title} - {offer.pointsRequired} Points
              </li>
            ))}
          </ul>
          {points >= 500 && (
            <>
              <h3>🌟 Exclusive Deals for Permanent Customers:</h3>
              <ul className="special-deals">
                {permanentCustomerDeals.map((deal) => (
                  <li key={deal.id}>{deal.title}</li>
                ))}
              </ul>
            </>
          )}
          <div className="reward-image-container">
            <img src={sideImage} alt="Rewards Info" className="reward-side-image" />
          </div>
        </div>
        <img src={headImage} alt="Logo" className="headImage" />
      </header>
    </div>
  );
}

export default PickupFormUpdate;
