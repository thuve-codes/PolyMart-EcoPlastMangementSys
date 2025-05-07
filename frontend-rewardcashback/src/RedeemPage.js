import React, { useState, useEffect } from 'react';

// Import images
import bottle from './assets/images/reusable-water-bottle.jpg';
import bag from './assets/images/eco bag.jpg';
import brush from './assets/images/brush.jpg';
import straw from './assets/images/straw.jpg';
import tote from './assets/images/tote bag.jpg';
import seedPaper from './assets/images/seed paper.jpg';
import phoneCase from './assets/images/phone case.jpg';
import solarCharger from './assets/images/solar charger.jpg';
import notebook from './assets/images/notebook.jpg';
import plantablePencil from './assets/images/plantable pencil.jpg';
import trashBags from './assets/images/trash bags.jpg';
import produceBags from './assets/images/produce bags.jpg';

const redeemableItems = [
  { id: 1, name: 'Reusable Water Bottle', points: 100, image: bottle },
  { id: 2, name: 'Eco Shopping Bag', points: 50, image: bag },
  { id: 3, name: 'Bamboo Toothbrush', points: 30, image: brush },
  { id: 4, name: 'Metal Straw Set', points: 25, image: straw },
  { id: 5, name: 'Organic Cotton Tote', points: 60, image: tote },
  { id: 6, name: 'Seed Paper Greeting Cards', points: 40, image: seedPaper },
  { id: 7, name: 'Compostable Phone Case', points: 80, image: phoneCase },
  { id: 8, name: 'Solar-Powered Charger', points: 100, image: solarCharger },
  { id: 9, name: 'Eco-Friendly Notebook', points: 20, image: notebook },
  { id: 10, name: 'Plantable Pencils', points: 15, image: plantablePencil },
  { id: 11, name: 'Biodegradable Trash Bags', points: 35, image: trashBags },
  { id: 12, name: 'Reusable Produce Bags', points: 45, image: produceBags },
];

function RedeemPage() {
  const [balance, setBalance] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [welcomeBonusMessage, setWelcomeBonusMessage] = useState('');

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedRedeemPage');
    let initialBalance = parseInt(localStorage.getItem('balance') || '0', 10);

    if (!hasVisited) {
      initialBalance += 100;
      localStorage.setItem('hasVisitedRedeemPage', 'true');
      localStorage.setItem('balance', initialBalance.toString());
      setWelcomeBonusMessage('🎉 Welcome! You’ve earned a 100-point bonus!');
      setTimeout(() => setWelcomeBonusMessage(''), 5000);
    }

    setBalance(initialBalance);
  }, []);

  const handleRedeem = () => {
    if (!selectedItem) return;
    if (balance < selectedItem.points) {
      alert(`Not enough points! You need ${selectedItem.points - balance} more points.`);
      return;
    }

    const newBalance = balance - selectedItem.points;
    setBalance(newBalance);
    localStorage.setItem('balance', newBalance.toString());

    setRedeemSuccess(true);
    setTimeout(() => setRedeemSuccess(false), 3000);
    setSelectedItem(null);
  };

  const handleResetPoints = () => {
    setBalance(100);
    localStorage.setItem('balance', '100');
  };

  return (
    <div className="redeem-page">
      <h1>Redeem Your Points</h1>

      <div className="balance-container">
        <p>Available Points: <strong>{balance}</strong></p>
      </div>

      {welcomeBonusMessage && (
        <div className="welcome-message">
          <p>{welcomeBonusMessage}</p>
        </div>
      )}

      {redeemSuccess && (
        <div className="success-message">
          <p>🎉 Redemption successful! Your item will be processed.</p>
        </div>
      )}

      <div className="items-grid">
        {redeemableItems.map((item) => (
          <div
            key={item.id}
            className={`item-card ${balance >= item.points ? '' : 'disabled'}`}
            onClick={() => balance >= item.points && setSelectedItem(item)}
          >
            <div className="item-image">
              <img src={item.image} alt={item.name} style={{ width: '100%', height: 'auto' }} />
            </div>
            <div className="item-details">
              <h3>{item.name}</h3>
              <p className="points-cost">{item.points} points</p>
              {balance < item.points && (
                <p className="not-enough">Need {item.points - balance} more points</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="redeem-modal">
          <div className="modal-content">
            <h2>Confirm Redemption</h2>
            <p>You are about to redeem:</p>
            <p className="item-name">{selectedItem.name}</p>
            <p className="points-cost">{selectedItem.points} points</p>
            <div className="modal-actions">
              <button onClick={() => setSelectedItem(null)}>Cancel</button>
              <button className="confirm" onClick={handleRedeem}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      <div className="reset-container">
        <button className="reset-button" onClick={handleResetPoints}>
          o
        </button>
      </div>
    </div>
  );
}

export default RedeemPage;
