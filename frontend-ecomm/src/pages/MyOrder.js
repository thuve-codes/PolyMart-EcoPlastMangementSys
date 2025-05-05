import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaBox, FaShippingFast, FaCheckCircle, FaTimesCircle, FaMoneyBillWave } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa';

import '../App.css';

const API_URL = process.env.REACT_APP_API_URL;

const cancelOrder = async (delorderId, setOrders) => {
  if (!window.confirm('Are you sure you want to cancel this order?')) return;
  try {
    const response = await axios.delete(`${API_URL}/api/v1/order/${delorderId}`);
    if (response.status === 204 || response.status === 200) {
      toast.success('Order is Cancelled Successfully');
      setOrders(prev => prev.filter(order => order._id !== delorderId));
    } else {
      toast.error('Failed to cancel order. Try again.');
    }
  } catch (err) {
    console.error(err);
    toast.error('Failed to cancel order. Try again.');
  }
};

const StatusIcon = ({ status }) => {
  switch (status) {
    case 'Processing': return <FaBox />;
    case 'Shipped': return <FaShippingFast />;
    case 'Delivered': return <FaCheckCircle />;
    case 'Cancelled': return <FaTimesCircle />;
    default: return <FaMoneyBillWave />;
  }
};

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        
        let storedUsername = localStorage.getItem('username');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const res = await axios.get(`${API_URL}/api/v1/order/${storedUsername}`, config);
        if (!res.data.success) throw new Error(res.data.error || 'Fetch failed');
        setOrders(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError(err.response?.data?.error || err.message || 'Error loading orders');
        setLoading(false);
        toast.error(err.response?.data?.error || 'Error loading orders');
      }
    };

    fetchOrders();
  }, [navigate]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric'
    });

  const downloadInvoice = async (orderId) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/order/report/${orderId}`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice_${orderId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Failed to download invoice');
      console.error(err);
    }
  };

  if (loading) return <div className="container"><div className="loading">Loading your orders...</div></div>;

  if (error) return (
    <div className="container">
      <div className="error-message">
        <p>Error: {error}</p>
        <Link className="back-to-home" to="/">Back to Home</Link>
      </div>
    </div>
  );

  if (orders.length === 0) return (
    <div className="container">
      <div className="empty-state">
        <div className="empty-icon"><FaBox size={48} /></div>
        <p className="empty-text">No orders found.</p>
        <Link className="back-to-home" to="/">Back to Home</Link>
      </div>
    </div>
  );

  return (
    <div className="container">

    <div className="order-policy">
      <h3>Order Processing & Cancellation Policy</h3>
      <p>
        Once you place an order, it will be marked as <strong>Processing</strong>. During this stage, you're able to cancel your order. However, after the order has been marked as <strong>Shipped</strong>, cancellations are no longer possible through our system. If you need to cancel a <strong>Shipped</strong> order, you can contact our delivery partner directly.
      </p>
      <p>
        In case of cancellation, the amount will be credited back to your account within <strong>14 days</strong> from the cancellation date. Please ensure you follow up with the delivery partner to proceed with the cancellation request.
      </p>
      <p>We appreciate your understanding and are here to assist you in any way we can!</p>
    </div>


      <div className="order-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div>
                <div className="order-id">Order #{order._id.substring(18)}</div>
                <div className="order-date">{formatDate(order.createdAt)}</div>
              </div>
              <div className={`order-status ${order.status.toLowerCase()}`}>
                <StatusIcon status={order.status} />
                {order.status}
              </div>
            </div>

            <div className="order-body">
              {order.items.map((item) => (
                <div key={item._id} className="order-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} loading="lazy" />
                  </div>
                  <div className="item-details">
                    <div className="item-name">{item.name}</div>
                    <div className="item-price">LKR {item.price.toFixed(2)}</div>
                    <div className="item-qty">Qty: {item.qty}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="order-total">Total: LKR {order.total.toFixed(2)}</div>
              <div className="order-actions">
                {order.status === 'Processing' && (
                  <button className="cancel-btn" onClick={() => cancelOrder(order._id, setOrders)}>Cancel</button>
                )}
               <p className="dwnldin" onClick={() => downloadInvoice(order._id)}>
                <FaDownload /> Download Invoice
              </p>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
