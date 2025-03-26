import React, { useState, useEffect } from 'react';
import plasticRequestService from '../slices/plasticRequestService';

const PlasticRequestForm = ({ requestId, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    user: '',
    plasticType: '',
    quantityKg: 0,
    location: '',
  });

  useEffect(() => {
    if (requestId) {
      plasticRequestService.getRequestById(requestId).then(request => {
        setFormData(request);
      });
    }
  }, [requestId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (requestId) {
      await plasticRequestService.updateRequest(requestId, formData);
    } else {
      await plasticRequestService.createRequest(formData);
    }
    onFormSubmit(); // Notify parent to refresh list
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Input fields for user, plasticType, quantityKg, location */}
      {/* ... */}
      <button type="submit">{requestId ? 'Update' : 'Create'}</button>
    </form>
  );
};

export default PlasticRequestForm;