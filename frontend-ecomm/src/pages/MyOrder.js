import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { FaBox, FaShippingFast, FaCheckCircle, FaTimesCircle, FaMoneyBillWave } from 'react-icons/fa';

const API_URL = "http://localhost:5001";


const cancelOrder = async (delorderId, setOrders) => {
  if (!window.confirm('Are you sure you want to cancel this order?')) {
    return;
  }
  try {
    const response = await axios.delete(`${API_URL}/api/v1/order/${delorderId}`);
    if (response.status === 204 || response.status === 200) {
      toast.success('Order is Cancelled Successfully');
      setOrders((prevOrders) => prevOrders.filter(order => order._id !== delorderId));
    } else {
      toast.error('Failed to cancel order. Try again.');
    }
  } catch (error) {
    console.error(error);
    toast.error('Failed to cancel order. Try again.');
  }
};




// Styled components
const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Header = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
`;

const OrderList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const OrderHeader = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OrderId = styled.div`
  font-weight: bold;
  color: #3498db;
`;

const OrderDate = styled.div`
  font-size: 0.9rem;
  color: #7f8c8d;
`;

const OrderStatus = styled.div`
  padding: 0.5rem;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  
  ${props => props.status === 'Processing' && `
    background: #fff3cd;
    color: #856404;
  `}
  
  ${props => props.status === 'Shipped' && `
    background: #cce5ff;
    color: #004085;
  `}
  
  ${props => props.status === 'Delivered' && `
    background: #d4edda;
    color: #155724;
  `}
  
  ${props => props.status === 'Cancelled' && `
    background: #f8d7da;
    color: #721c24;
  `}
`;

const OrderBody = styled.div`
  padding: 1rem;
`;

const OrderItem = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const ItemImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 5px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: bold;
  margin-bottom: 0.3rem;
`;

const ItemPrice = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
`;

const ItemQty = styled.div`
  font-size: 0.9rem;
`;

const OrderFooter = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OrderTotal = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: #2c3e50;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  color: #bdc3c7;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 1.5rem;
`;

const BackToHome = styled(Link)`
  padding: 0.8rem 1.5rem;
  background: #3498db;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.3s ease;
  
  &:hover {
    background: #2980b9;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #7f8c8d;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background: #f8d7da;
  border-radius: 10px;
  color: #721c24;
  margin: 2rem 0;
`;

// Status icon component
const StatusIcon = ({ status }) => {
  switch (status) {
    case 'Processing':
      return <FaBox />;
    case 'Shipped':
      return <FaShippingFast />;
    case 'Delivered':
      return <FaCheckCircle />;
    case 'Cancelled':
      return <FaTimesCircle />;
    default:
      return <FaMoneyBillWave />;
  }
};

const CancelBtn = styled.div`
  display: flex;
  justify-content: flex-end; // or 'center' depending on your layout
  margin: 10px 0;
  
  button {
    padding: 8px 16px;
    background-color: #ff4444;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: #cc0000;
    }
  }
`;

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        const response = await axios.get(`${API_URL}/api/v1/order`, config);

        if (!response.data.success) {
          throw new Error(response.data.error || 'Failed to fetch orders');
        }

        setOrders(response.data.data); // Array of orders
        setLoading(false);
      } catch (err) {
        console.error('Fetch orders error:', err);
        setError(err.response?.data?.error || err.message || 'Failed to load orders');
        setLoading(false);
        toast.error(err.response?.data?.error || 'Failed to load orders');

        // if (err.response?.status === 401) {
        //   navigate('/login');
        // }
      }
    };

    fetchOrders();
  }, [navigate]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // const getImageUrl = (imagePath) => {
  //   // Ensure the correct base URL for images
  //   return `${API_URL}${imagePath}`;
  // };

  if (loading) {
    return (
      <Container>
        <Loading>Loading your orders...</Loading>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>
          <p>Error: {error}</p>
          <BackToHome to="/">Back to Home</BackToHome>
        </ErrorMessage>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container>
        <EmptyState>
          <EmptyIcon>
            <FaBox size={48} />
          </EmptyIcon>
          <EmptyText>No orders found.</EmptyText>
          <BackToHome to="/">Back to Home</BackToHome>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>My Orders</Header>
      <OrderList>
        {orders.map((order) => (
          <OrderCard key={order._id}>
            <OrderHeader>
              <div>
                <OrderId>Order #{order._id.substring(18)}</OrderId>
                <OrderDate>{formatDate(order.createdAt)}</OrderDate>
              </div>
              <OrderStatus status={order.status}>
                <StatusIcon status={order.status} />
                {order.status}
              </OrderStatus>
            </OrderHeader>
            
            <OrderBody>
              {order.items.map((item) => (
                <OrderItem key={item._id}>
                  <ItemImage>
                  <img 
                    src={item.image} 
                    alt={item.name || 'Item image'} 
                    loading="lazy" 
                  />
                    </ItemImage>

                  <ItemDetails>
                    <ItemName>{item.name}</ItemName>
                    <ItemPrice>LKR {item.price.toFixed(2)}</ItemPrice>
                    <ItemQty>Qty: {item.qty}</ItemQty>
                  </ItemDetails>
                </OrderItem>
              ))}
            </OrderBody>
            
            <OrderFooter>
              <OrderTotal>Total: LKR {order.total.toFixed(2)}</OrderTotal>
              <CancelBtn>
                {order.status === 'Processing' && (
                  <button 
                    onClick={() => {
                      cancelOrder(order._id,setOrders)
                      
                      // You can also call delete logic here if needed
                    }}
                  >
                    Cancel
                  </button>
                )}
              </CancelBtn>

              
            </OrderFooter>
          </OrderCard>
        ))}
      </OrderList>
    </Container>
  );
};

export default MyOrders;
