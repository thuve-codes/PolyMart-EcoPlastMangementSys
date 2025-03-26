import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PlasticRequestList from '../components/PlasticRequestList';
import PlasticRequestForm from '../components/PlasticRequestForm';
import PlasticRequestDetails from '../components/PlasticRequestDetails';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const view = queryParams.get('view') || 'list'; // Default to 'list'
  const requestId = queryParams.get('requestId');

  const handleSelectRequest = (id) => {
    navigate(`/admin/dashboard?view=details&requestId=${id}`);
  };

  const handleCreateRequest = () => {
    navigate('/admin/dashboard?view=create');
  };

  const handleListRequest = () => {
    navigate('/admin/dashboard?view=list');
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <Header />
        <div className="p-6">
          {view === 'list' && <PlasticRequestList onSelectRequest={handleSelectRequest} />}
          {view === 'create' && <PlasticRequestForm onFormSubmit={handleListRequest} />}
          {view === 'details' && requestId && <PlasticRequestDetails requestId={requestId} />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;