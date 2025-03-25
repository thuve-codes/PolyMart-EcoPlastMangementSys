import { useState } from "react";
import "./RewardPoints.css";
import bannerImage from "./Assests/images/redeem.png";
import sideImage from "./Assests/images/points.jpg";

function RewardPoints() {
  const [bottleType, setBottleType] = useState("");
  const [weight, setWeight] = useState("");
  const [points, setPoints] = useState(0);

  // Points per kg for different bottle types
  const pointRates = {
    plastic: 10, // 10 points per kg
    glass: 8,
    metal: 15,
    other: 5
  };


  const offers = [
    { id: 1, title: "10% Discount on Recycled Products", pointsRequired: 100 },
    { id: 2, title: "Free Eco-Friendly Tote Bag", pointsRequired: 200 },
    { id: 3, title: "Special Membership Badge", pointsRequired: 300 }
  ];

  const permanentCustomerDeals = [
    { id: 1, title: "Exclusive 25% Discount on Plastic-Free Products" },
    { id: 2, title: "VIP Access to Recycling Events" },
    { id: 3, title: "Priority Collection Service" }
  ];
  // Function to calculate points
  const calculatePoints = () => {
    if (bottleType && weight) {
      const earnedPoints = weight * (pointRates[bottleType] || 0);
      setPoints((prevPoints) => prevPoints + earnedPoints);
    } else {
      alert("Please select a bottle type and enter weight!");
    }
  };

  return (
    <div className="reward-container">
      <img src={bannerImage} alt="Reward Program Banner" className="reward-banner" />
      <h1>🎉 Earn Reward Points & Get Exclusive Offers! 🎉</h1>
      <div className="form-group">
        <label>Select Bottle Type:</label>
        <select value={bottleType} onChange={(e) => setBottleType(e.target.value)}>
          <option value="">Select</option>
          <option value="plastic">Plastic</option>
          <option value="glass">Glass</option>
          <option value="metal">Metal</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label>Enter Weight (kg):</label>
        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
      </div>

      <button onClick={calculatePoints}>Calculate Points</button>
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
  );
}

export default RewardPoints;
