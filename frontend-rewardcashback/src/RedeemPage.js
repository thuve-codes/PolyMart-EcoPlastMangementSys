import React, { useState } from 'react';

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
  { id: 8, name: 'Solar-Powered Charger', points: 150, image: solarCharger },
  { id: 9, name: 'Eco-Friendly Notebook', points: 20, image: notebook },
  { id: 10, name: 'Plantable Pencils', points: 15, image: plantablePencil },
  { id: 11, name: 'Biodegradable Trash Bags', points: 35, image: trashBags },
  { id: 12, name: 'Reusable Produce Bags', points: 45, image: produceBags },
];

function RedeemPage() {
  const [balance] = useState(150);
  const [selectedItem, setSelectedItem] = useState(null);
  const [redeemSuccess, setRedeemSuccess] = useState(false);

  const handleRedeem = () => {
    if (!selectedItem) return;
    if (balance < selectedItem.points) {
      alert('Not enough points!');
      return;
    }
    console.log(`Redeemed ${selectedItem.name} for ${selectedItem.points} points`);
    setRedeemSuccess(true);
    setTimeout(() => setRedeemSuccess(false), 3000);
    setSelectedItem(null);
  };

  return (
    <div className="redeem-page">
      <h1>Redeem Your Points</h1>

      <div className="balance-display">
        <p>Available Points: <strong>{balance}</strong></p>
      </div>

      {redeemSuccess && (
        <div className="success-message">
          <p>Redemption successful! Your item will be processed.</p>
        </div>
      )}

      <div className="items-grid">
        {redeemableItems.map(item => (
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
    </div>
  );
}

export default RedeemPage;
