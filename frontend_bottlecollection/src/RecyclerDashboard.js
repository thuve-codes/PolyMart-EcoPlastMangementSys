import React, { useState, useEffect } from 'react';
import './RecyclerDashboard.css';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import logo from './Assests/images/polymart-logo.png';

const RecyclerDashboard = () => {
  const storedEmail = localStorage.getItem('userEmail') || '';
  const storedName = localStorage.getItem('userName') || 'Recycler';

  const [pickupRequests, setPickupRequests] = useState([]);
  const [recyclingHistory, setRecyclingHistory] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]); // NEW
  const [loadingPickupRequests, setLoadingPickupRequests] = useState(true);
  const [loadingRecyclingHistory, setLoadingRecyclingHistory] = useState(true);
  const [loadingRecentActivities, setLoadingRecentActivities] = useState(true); // NEW

  const [editingActivity, setEditingActivity] = useState(null); // Track the activity being edited
  const [updatedData, setUpdatedData] = useState({}); // Store the updated values
  const [monthlyReport, setMonthlyReport] = useState(null);

  // Fetch Available Pickup Requests
  const fetchPickupRequests = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/recycler/pickup-requests?email=${storedEmail}`);
      const data = await response.json();
      const today = new Date().toISOString().split('T')[0];
      const filteredData = data.filter((item) => {
        const createdDate = new Date(item.createdAt).toISOString().split('T')[0];
        return createdDate === today;
      });
      setPickupRequests(filteredData);
    } catch (error) {
      console.error('Error fetching available pickups:', error);
    } finally {
      setLoadingPickupRequests(false);
    }
  };

  // Fetch Recycling History
  const fetchRecyclingHistory = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/recycler/recycling-history?email=${storedEmail}`);
      const data = await response.json();
      setRecyclingHistory(data);
    } catch (error) {
      console.error('Error fetching recycling history:', error);
    } finally {
      setLoadingRecyclingHistory(false);
    }
  };

  // Fetch Recent Activities (Today)
  const fetchRecentActivities = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/recycler/recent-activities?email=${storedEmail}`);
      const data = await response.json();
      setRecentActivities(data);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
    } finally {
      setLoadingRecentActivities(false);
    }
  };


  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setUpdatedData({
      bottleType: activity.bottleType || '',
      weight: activity.weight || '',
      pickupDate: activity.pickupDate || '',
      feedback: activity.feedback || '',
      disposalPurpose: activity.disposalPurpose || '',
      points: activity.points || '',
    });
  };

  const handleChange = (e) => {
    setUpdatedData({
      ...updatedData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateActivity = async (activityId) => {
    try {
      let pointsPerKg = 0;
      // Calculate points based on the bottle type and weight
      switch (updatedData.bottleType) {
        case "plastic type 1":
          pointsPerKg = 2;
          break;
        case "plastic type 2":
          pointsPerKg = 3;
          break;
        case "plastic type 3":
          pointsPerKg = 4;
          break;
        case "other":
          pointsPerKg = 1;
          break;
        default:
          pointsPerKg = 0;
      }
  
      // Calculate total points
      const totalPoints = pointsPerKg * updatedData.weight;
  
      // Add the calculated points to the updatedData object (omit points field from form)
      const updatedActivity = { ...updatedData, points: totalPoints };
  
      const response = await fetch(`http://localhost:5000/api/recycler/update-recent-activity/${activityId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedActivity),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("Activity updated successfully");
        setRecentActivities((prev) =>
          prev.map((activity) =>
            activity._id === activityId ? { ...activity, ...updatedActivity } : activity
          )
        );
        setEditingActivity(null); // Reset editing activity
      } else {
        alert("Error updating activity: " + data.error);
      }
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };
  
  const getMonthlyActivityData = () => {
    const activityByDate = {};
  
    recyclingHistory.forEach((entry) => {
      const date = new Date(entry.pickupDate).toISOString().split('T')[0];
      if (!activityByDate[date]) {
        activityByDate[date] = 0;
      }
      activityByDate[date] += entry.points || 0;
    });
  
    const sortedDates = Object.keys(activityByDate).sort();
    return sortedDates.map((date) => ({
      date,
      points: activityByDate[date],
    }));
  };
  
  

  const handleDeleteActivity = async (activityId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/recycler/delete-recent-activity/${activityId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        alert("Activity deleted successfully");
        setRecentActivities((prev) =>
          prev.filter((activity) => activity._id !== activityId)
        );
      } else {
        alert("Error deleting activity: " + data.error);
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const calculateTotalPoints = () => {
    return recyclingHistory.reduce((total, activity) => total + (activity.points || 0), 0);
  };
  

  const handleGenerateReport = () => {
    const now = new Date();
    const monthName = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
  
    const monthlyPickups = recyclingHistory.filter((pickup) => {
      const date = new Date(pickup.pickupDate);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
  
    const monthlyPoints = monthlyPickups.reduce((total, pickup) => {
      return total + (pickup.points || 0);
    }, 0);
  
    setMonthlyReport({
      month: monthName,
      year: year,
      pickups: monthlyPickups.length,
      points: monthlyPoints
    });
  
    // Generate QR code (example: link to profile or report page)
    const qrData = `https://polymart.eco/user-report/${monthName}-${year}`; // replace with your real URL
    QRCode.toDataURL(qrData).then((qrUrl) => {
      const doc = new jsPDF();
      const img = new Image();
      img.src = logo;
  
      img.onload = () => {
        // Logo & header
        doc.addImage(img, 'PNG', 20, 10, 40, 20);
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("Recycling Receipt", 105, 20, { align: "center" });
  
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Generated on: ${now.toLocaleString()}`, 105, 28, { align: "center" });
  
        doc.setLineWidth(0.5);
        doc.line(20, 32, 190, 32);
  
        // Summary section
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Monthly Summary", 20, 42);
  
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Month: ${monthName} ${year}`, 20, 52);
        doc.text(`Total Pickups: ${monthlyPickups.length}`, 20, 60);
        doc.text(`Total Points Earned: ${monthlyPoints}`, 20, 68);
  
        doc.line(20, 75, 190, 75);
  
        // Table
        let y = 85;
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.text("Detailed Pickup History", 20, y);
        y += 8;
  
        doc.setFontSize(11);
        doc.text("Date", 20, y);
        doc.text("Bottle Type", 60, y);
        doc.text("Weight (kg)", 110, y);
        doc.text("Points", 160, y);
        y += 4;
        doc.line(20, y, 190, y);
        y += 6;
  
        doc.setFont("helvetica", "normal");
  
        monthlyPickups.forEach((item) => {
          const date = new Date(item.pickupDate).toLocaleDateString();
          doc.text(date, 20, y);
          doc.text(item.bottleType || "-", 60, y);
          doc.text((item.weight || 0).toFixed(2), 110, y);
          doc.text((item.points || 0).toString(), 160, y);
          y += 6;
  
          if (y > 280) {
            doc.addPage();
            y = 20;
          }
        });
  
        // Footer
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
  
        doc.setFontSize(10);
        doc.text("Thank you for being an active recycler!", 20, y + 10);
        doc.text("PolyMart | polymart.eco", 20, y + 16);
  
        // QR Code (bottom right corner)
        doc.addImage(qrUrl, 'PNG', 150, y + 5, 40, 40); // adjust size/position as needed
  
        // Save
        doc.save(`Recycling_Receipt_${monthName}_${year}.pdf`);
      };
    });
  };
  
  
  

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchPickupRequests(),
        fetchRecyclingHistory(),
        fetchRecentActivities(),
      ]);
    };
    if (storedEmail) {
      fetchData();
    }
  }, [storedEmail]);

  
  return (
    <div style={{ padding: '20px' }}>
      <h1>{storedName}'s Recycler Dashboard</h1>

      {/* Recycler Info */}
      <section>
        <h2>Recycler Information</h2>
        <p>Name: {storedName}</p>
        <p>Email: {storedEmail}</p>
        <p style={{ fontWeight: 'bold', color: '#9C27B0' }}>
          Total Points: {calculateTotalPoints()}
        </p>
      </section>

      <section
        style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
          fontFamily: 'Arial, sans-serif',
          color: '#333'
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: '20px'
          }}
        >
          <img
            src={logo}
            alt="Logo"
            className="logo"
            style={{
              maxWidth: '150px',
              marginBottom: '10px'
            }}
          />
          <h3
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#4CAF50'
            }}
          >
            Monthly Report
          </h3>
        </div>

        <button
          onClick={handleGenerateReport}
          style={{
            padding: '12px 25px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            marginBottom: '20px',
            display: 'block',
            width: '100%',
            textAlign: 'center'
          }}
        >
          Download Monthly Report (PDF)
        </button>

        {monthlyReport && (
          <div
            style={{
              marginTop: '20px',
              padding: '20px',
              backgroundColor: '#ffffff',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '16px',
              lineHeight: '1.6',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
           <p>Your monthy report has been sent to downloads</p>
          </div>
        )}
      </section>



      {/* Monthly Activity Chart */}
      <section className="activity-chart-section">
        <h2 className="chart-title">Monthly Recycling Activity</h2>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={getMonthlyActivityData()} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                label={{ value: 'Date (X-axis)', position: 'insideBottom', offset: -30 }}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                label={{ value: 'Points Earned (Y-axis)', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="points" 
                stroke="#9C27B0" 
                strokeWidth={2} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>



      {/* Available Pickup Requests */}
      <section>
        <h2>Available Pickup Requests</h2>
        {loadingPickupRequests ? (
          <p>Loading available pickup requests...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Location</th>
                <th>Material</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              {pickupRequests.length > 0 ? (
                pickupRequests.map((request) =>
                  request.status === 'Pending' ? (
                    <tr key={request._id}>
                      <td>{request._id}</td>
                      <td>{request.address}</td>
                      <td>{request.bottleType}</td>
                      <td>{request.weight} kg</td>
                     
                    </tr>
                  ) : null
                )
              ) : (
                <tr>
                  <td colSpan="6">No available pickup requests.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>

     

      {/* Recycling History */}
      <section>
        <h2>Your Recycling History</h2>
        {loadingRecyclingHistory ? (
          <p>Loading your recycling history...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Material</th>
                <th>Weight</th>
                <th>Pickup Date</th>
                <th>Feedback</th>
                <th>Disposal Purpose</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {recyclingHistory.length > 0 ? (
                recyclingHistory.map((history) => (
                  <tr key={history._id}>
                    <td>{history._id}</td>
                    <td>{history.bottleType}</td>
                    <td>{history.weight}</td>
                    <td>{new Date(history.pickupDate).toLocaleDateString()}</td>
                    <td>{history.feedback || 'No feedback'}</td>
                    <td>{history.disposalPurpose}</td>
                    <td>{history.points}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No recycling history available.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>

      {/* Recent Activities */}
      <section>
        <h2>Your Recent Activities</h2>
        {loadingRecentActivities ? (
          <p>Loading your recent activities...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Material</th>
                <th>Weight</th>
                <th>Pickup Date</th>
                <th>Feedback</th>
                <th>Disposal Purpose</th>
                <th>Points</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <tr key={activity._id}>
                    <td>{activity._id}</td>
                    <td>{activity.bottleType}</td>
                    <td>{activity.weight}</td>
                    <td>{new Date(activity.pickupDate).toLocaleDateString()}</td>
                    <td>{activity.feedback || 'No feedback'}</td>
                    <td>{activity.disposalPurpose}</td>
                    <td>{activity.points}</td>
                    <td>
                      <button onClick={() => handleEditActivity(activity)} 
                        style={{ backgroundColor: 'green', color: 'white', fontWeight: 'bold', border: 'none', padding: '8px 12px', borderRadius: '4px' }}
                        >Edit</button>

                      <button onClick={() => handleDeleteActivity(activity._id)} 
                        style={{ backgroundColor: 'red', color: 'white', fontWeight: 'bold', border: 'none', padding: '8px 12px', borderRadius: '4px' }}
                        >Delete</button>

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No recent activities.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {editingActivity && (
          <div className="edit-activity-container">
            <h3>Edit Activity</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateActivity(editingActivity._id); }} className="edit-activity-form">
              <table>
                <tbody>
                  <tr>
                    <td><label htmlFor="bottleType">Bottle Type</label></td>
                    <td>
                      <select name="bottleType" value={updatedData.bottleType} onChange={handleChange} required>
                        <option value="">Select Bottle Type</option>
                        <option value="plastic type 1">Plastic type 1(LDPE)</option>
                        <option value="plastic type 2">Plastic type 2(PVC)</option>
                        <option value="plastic type 3">Plastic type 3(HDPE)</option>
                        <option value="other">Other</option>
                      </select>
                    </td>
                  </tr>

                  <tr>
                    <td><label htmlFor="weight">Weight</label></td>
                    <td>
                      <input
                        type="number"
                        name="weight"
                        value={updatedData.weight}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </td>
                  </tr>

                  <tr>
                    <td><label htmlFor="pickupDate">Pickup Date</label></td>
                    <td>
                      <input
                        type="date"
                        name="pickupDate"
                        value={updatedData.pickupDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]} // restrict to today or future
                        required
                      />
                    </td>
                  </tr>

                  <tr>
                    <td><label htmlFor="feedback">Feedback</label></td>
                    <td>
                      <input
                        type="text"
                        name="feedback"
                        value={updatedData.feedback}
                        onChange={handleChange}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td><label htmlFor="disposalPurpose">Disposal Purpose</label></td>
                    <td>
                      <select name="disposalPurpose" value={updatedData.disposalPurpose} onChange={handleChange} required>
                        <option value="">Select Purpose</option>
                        <option value="recycle">Recycle</option>
                        <option value="dispose">Dispose</option>
                        <option value="reuse">Reuse</option>
                        <option value="other">Other</option>
                      </select>
                    </td>
                  </tr>

                  <tr>
                    <td><label htmlFor="points">Points</label></td>
                    <td>
                      <input
                        type="number"
                        name="points"
                        value={updatedData.points}
                        onChange={handleChange}
                        disabled
                      />
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="submit-btn-cell">
                      <button type="submit" className="update-btn">Update Activity</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          </div>
        )}


      </section>
    </div>
  );
};

export default RecyclerDashboard;
