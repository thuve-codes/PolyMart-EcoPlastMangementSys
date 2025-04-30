import { useState, useEffect } from 'react';
import './PickupForm.css';
import { useNavigate } from 'react-router-dom';

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
    points: 0,  // Include points in the form data
  });
  
  const [errors, setErrors] = useState({
    contactNumber: "",
    pickupDate: "",
  });

  const navigate = useNavigate(); 

  // Use the email stored in localStorage to pre-fill the email field
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');  // Retrieve email from localStorage
    if (storedEmail) {
      setFormData((prevData) => ({
        ...prevData,
        email: storedEmail,  // Pre-fill the email
      }));

      // Fetch the pickup data for the last submitted email
      fetch(`http://localhost:5000/api/bottles/${storedEmail}`)
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setFormData(data);  // Set the retrieved data in the form
            // Calculate points on data load if bottleType and weight are available
            calculatePoints(data.weight, data.bottleType);
          }
        })
        .catch((error) => console.error("Error fetching pickup data:", error));
    }
  }, []); // Run only once on component mount

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update formData
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Recalculate points when bottleType or weight changes
    if (name === "bottleType" || name === "weight") {
      calculatePoints(value, formData.bottleType);  // Recalculate with the new value
    }

    // Handle validation
    if (name === "contactNumber" && value.length !== 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        contactNumber: "Contact number must be exactly 10 digits.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        contactNumber: "",
      }));
    }

    if (name === "pickupDate") {
      const today = new Date().toISOString().split('T')[0];
      if (value < today) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          pickupDate: "Pickup date cannot be in the past.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          pickupDate: "",
        }));
      }
    }
  };

  const calculatePoints = (weight, bottleType) => {
    let pointsPerKg = 0;

    switch (bottleType) {
      case "plastic type 1": pointsPerKg = 2; break;
      case "plastic type 2": pointsPerKg = 3; break;
      case "plastic type 3": pointsPerKg = 4; break;
      case "other": pointsPerKg = 1; break;
      default:
        pointsPerKg = 0;
    }

    const totalPoints = weight ? parseFloat(weight) * pointsPerKg : 0;
    setFormData((prevData) => ({
      ...prevData,
      points: totalPoints,  // Update the points in formData
    }));
  };

  const handleUpdate = () => {
    // Check if there are any validation errors
    if (errors.contactNumber || errors.pickupDate) {
      alert("Please correct the errors before updating.");
      return;
    }

    fetch('http://localhost:5000/api/bottles/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),  // Include points in the body
    })
      .then((response) => response.json())
      .then(() => {
        alert("Form updated successfully!");
        navigate('/RecyclerDashboard');  // Redirect to the Recycler Dashboard
      })
      .catch((error) => alert('Error updating form.'));
  };

  const handleDelete = () => {
    fetch('http://localhost:5000/api/bottles/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email }),
    })
      .then((response) => response.json())
      .then(() => {
        alert('Form deleted successfully.');
        setFormData({
          name: "", email: "", contactNumber: "", address: "",
          bottleType: "", weight: "", feedback: "", disposalPurpose: "", pickupDate: "", points: 0
        });
      })
      .catch((error) => alert('Error deleting form.'));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="headingPrimary">Plastic Bottle Collection</h1>
        <h2 className="headingSecondary">You can Update Your Form if needed</h2>

        <form>
          <table className="table centeredTable">
            <tbody>
              <tr style={{ display: 'none' }}>
                <td><label htmlFor="name">Name</label></td>
                <td><input type="text" name="name" value={formData.name} readOnly /></td>
              </tr>

              {/* Email is hidden, but still part of form data */}
              <tr style={{ display: 'none' }}>
                <td><label htmlFor="email">Email</label></td>
                <td><input type="email" name="email" value={formData.email} readOnly /></td>
              </tr>

              <tr>
                <td><label htmlFor="contactNumber">Contact Number</label></td>
                <td>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    maxLength="10"
                  />
                  {errors.contactNumber && <span className="error">{errors.contactNumber}</span>}
                </td>
              </tr>

              <tr>
                <td><label htmlFor="address">Address</label></td>
                <td><textarea name="address" value={formData.address} onChange={handleChange} /></td>
              </tr>

              <tr>
                <td><label htmlFor="bottleType">Bottle Type</label></td>
                <td>
                  <select name="bottleType" value={formData.bottleType} onChange={handleChange}>
                    <option value="">Select Bottle Type</option>
                    <option value="plastic type 1">Plastic type 1(LDPE)</option>
                    <option value="plastic type 2">plastic type 2(PVC)</option>
                    <option value="plastic type 3">plastic type 3(HDPE)</option>
                    <option value="other">Other</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td><label htmlFor="weight">Weight (kg)</label></td>
                <td><input type="number" name="weight" value={formData.weight} onChange={handleChange} /></td>
              </tr>

              <tr>
                <td><label htmlFor="feedback">Feedback</label></td>
                <td><textarea name="feedback" value={formData.feedback} onChange={handleChange} /></td>
              </tr>

              <tr>
                <td><label htmlFor="disposalPurpose">Purpose of Disposal</label></td>
                <td>
                  <select name="disposalPurpose" value={formData.disposalPurpose} onChange={handleChange}>
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
                  <input
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
                  />
                  {errors.pickupDate && <span className="error">{errors.pickupDate}</span>}
                </td>
              </tr>

              {/* No points field in the UI */}
              <tr>
                <td colSpan="2">
                  <button type="button" onClick={handleUpdate}>Update</button>
                  <button type="button" onClick={handleDelete} style={{ marginLeft: "10px" }}>Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </header>
    </div>
  );
}

export default PickupFormUpdate;
