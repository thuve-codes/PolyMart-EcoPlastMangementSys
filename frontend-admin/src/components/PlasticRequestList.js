import React, { useState, useEffect } from 'react';
import plasticRequestService from '../slices/plasticRequestService';

const PlasticRequestList = ({ onSelectRequest }) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    plasticRequestService.getAllRequests().then(data => setRequests(data));
  }, []);

  return (
    <div>
      {requests.map(request => (
        <div key={request._id} onClick={() => onSelectRequest(request._id)}>
          {/* Display request details */}
        </div>
      ))}
    </div>
  );
};

export default PlasticRequestList;