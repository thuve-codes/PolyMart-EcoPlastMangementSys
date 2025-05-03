import React, { useState, useEffect } from 'react';

function RewardDashboard() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockTransactions = [
      { id: 1, type: 'earn', points: 50, description: 'Recycled plastic', date: new Date() },
      { id: 2, type: 'redeem', points: 20, description: 'Eco bag', date: new Date(Date.now() - 86400000) },
      { id: 3, type: 'earn', points: 30, description: 'Recycled paper', date: new Date(Date.now() - 172800000) }
    ];
    
    const calculatedBalance = mockTransactions.reduce((total, tx) => {
      return tx.type === 'earn' ? total + tx.points : total - tx.points;
    }, 0);
    
    setBalance(calculatedBalance);
    setTransactions(mockTransactions.slice(0, 5));
    setLoading(false);
  }, []);

  return (
    <div className="dashboard">
      <h1>Reward Points</h1>
      
      <div className="balance-card">
        <h2>Your Current Balance</h2>
        <p className="points">{balance} pts</p>
      </div>
      
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="activity-list">
            {transactions.map(tx => (
              <li key={tx.id} className={`activity-item ${tx.type}`}>
                <div className="activity-points">
                  {tx.type === 'earn' ? '+' : '-'}{tx.points} pts
                </div>
                <div className="activity-details">
                  <p>{tx.description}</p>
                  <small>{new Date(tx.date).toLocaleDateString()}</small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default RewardDashboard;