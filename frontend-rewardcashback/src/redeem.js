import React, { useState } from 'react';
import './page2.css';


function Redeem() {
  const [points, setPoints] = useState(120);
  const [bottleType, setBottleType] = useState('');
  const [weight, setWeight] = useState('');
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [calculationDetails, setCalculationDetails] = useState('');

  const pointRates = {
    plastic: 10,
    glass: 8,
    metal: 15,
    other: 5,
  };

  const offers = [
    { id: 1, title: '10% Discount on Recycled Products', pointsRequired: 100 },
    { id: 2, title: 'Free Eco-Friendly Tote Bag', pointsRequired: 200 },
    { id: 3, title: 'Special Membership Badge', pointsRequired: 300 },
  ];

  const permanentCustomerDeals = [
    { id: 1, title: 'Exclusive 25% Discount on Plastic-Free Products' },
    { id: 2, title: 'VIP Access to Recycling Events' },
    { id: 3, title: 'Priority Collection Service' },
  ];

  const calcPoints = () => {
    if (!bottleType || weight === '') {
      alert('Please select a bottle type and enter weight!');
      return;
    }

    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      alert('Please enter a valid positive weight!');
      return;
    }

    const rate = pointRates[bottleType] || 0;
    const earnedPoints = weightValue * rate;

    setPoints((prevPoints) => prevPoints + earnedPoints);
    setRedeemPoints(earnedPoints);

    setCalculationDetails(`${bottleType.charAt(0).toUpperCase() + bottleType.slice(1)} Bottle ${weightValue}kg × ${rate} = ${earnedPoints} Points`);
  };

  return (
    <div>
    

      <div className="dashboard-container">
        <div className="reward-container">
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
                    <input 
                      type="number" 
                      value={weight} 
                      onChange={(e) => setWeight(e.target.value)}
                      min="0.01" 
                      step="0.01" 
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button onClick={calcPoints}>Calculate Points</button>

          {/* Display Calculation Process */}
          {calculationDetails && (
            <div className="calculation-details">
              <h3>Calculation:</h3>
              <p>{calculationDetails}</p>
            </div>
          )}

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
        </div>
      </div>
    </div>
  );
}

export default Redeem;
