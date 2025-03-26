import React, { useState, useEffect } from 'react';
import plasticRequestService from '../slices/plasticRequestService';

const PlasticRequestDetails = ({ requestId }) => {
  const [request, setRequest] = useState(null);

  useEffect(() => {
    plasticRequestService.getRequestById(requestId).then(data => setRequest(data));
  }, [requestId]);

  if (!request) return <div>Loading...</div>;

  return (
    <div>
      {/* Display request details */}
    </div>
  );
};

export default PlasticRequestDetails;