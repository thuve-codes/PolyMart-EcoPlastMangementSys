import React, { useState } from 'react';

const redeemableItems = [
  { id: 1, name: 'Reusable Water Bottle', points: 100, image: 'reusable-water-bottle.avif' },
  { id: 2, name: 'Eco Shopping Bag', points: 50, image: 'eco bag.jpeg' },
  { id: 3, name: 'Bamboo Toothbrush', points: 30, image: 'brush.jpeg' },
  { id: 4, name: 'Metal Straw Set', points: 25, image: 'straw.jpeg' },
  { id: 5, name: 'Organic Cotton Tote', points: 60, image: 'tote bag.jpeg' },
  { id: 6, name: 'Seed Paper Greeting Cards', points: 40, image: 'seed paper.jpeg' },
  { id: 7, name: 'Compostable Phone Case', points: 80, image: 'phone case.jpeg' },
  { id: 8, name: 'Solar-Powered Charger', points: 150, image: 'solar charger.jpeg' },
  { id: 9, name: 'Eco-Friendly Notebook', points: 20, image: 'notebook.jpeg' },
  { id: 10, name: 'Plantable Pencils', points: 15, image: 'plantable pencil.jpeg' }, 
  { id: 11, name: 'Biodegradable Trash Bags', points: 35, image: 'trash bags.jpeg' },
  { id: 12, name: 'Reusable Produce Bags', points: 45, image: 'produce bags.jpeg' },
  
    
];

function RedeemPage() {
  const [balance] = useState(150); // Mock balance - replace with actual state
  const [selectedItem, setSelectedItem] = useState(null);
  const [redeemSuccess, setRedeemSuccess] = useState(false);

  const handleRedeem = () => {
    if (!selectedItem) return;
    if (balance < selectedItem.points) {
      alert('Not enough points!');
      return;
    }
    
    // In a real app, you would call an API here
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
              {/* In a real app, use actual images */}
              <div className="placeholder-image">{item.name.charAt(0)}</div>
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
              <button className="confirm" onClick={handleRedeem}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RedeemPage;