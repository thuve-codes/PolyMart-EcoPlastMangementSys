import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React,{useEffect } from 'react';
import Home from './Homepage';
import PickupForm from './PickupForm'
import CollectionTracking from './CollectionTracking';
import RecyclingCentersPage from './RecyclingCentersPage';
import RecyclingTrackingPage from './RecyclingTrackingPage';
import RewardPoints from './rewardPoints';
import Notifications from './Notifications';
import RecyclerDashboard from './RecyclerDashboard';
import Header from './Header';
import PickupStatusPage from './PickupStatusPage';
import PickupFormUpdate from './PickupFormUpdate';
import Footer from '../src/Components/Footer';


function App() {
  useEffect(() => {
    const loginChannel = new BroadcastChannel('auth_channel');

    loginChannel.onmessage = (event) => {
      const { type, username, token } = event.data;

      if (type === 'LOGIN') {
        localStorage.setItem('username', username);
        localStorage.setItem('token', token);
        window.location.reload(); // Refresh app to reflect login
      }

      if (type === 'LOGOUT') {
        localStorage.clear();
        window.location.href = '/';
      }
    };

    return () => loginChannel.close(); // Cleanup on unmount
  }, []);
  return(
    
  <BrowserRouter>
     <div className= "App">
      <Header/>
     <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/Home" element={<Home/>} />
        <Route path="/PickupForm" element={<PickupForm/>} />
        <Route path="/RecyclingCentersPage" element={<RecyclingCentersPage/>} />
        <Route path="/CollectionTracking" element={<CollectionTracking/>} />
        <Route path="/RewardPoints" element={<RewardPoints/>} />
        <Route path="/Notifications" element={<Notifications/>} />
        <Route path="/RecyclerDashboard" element={<RecyclerDashboard/>} />
        <Route path="/RecyclingTrackingPage" element={<RecyclingTrackingPage/>} />
        <Route path="/Header" element={<Header/>} />
        <Route path="/PickupStatusPage" element={<PickupStatusPage/>} />
        <Route path="/PickupFormUpdate" element={<PickupFormUpdate/>} />
      </Routes>
     </div>
  <Footer/>
  </BrowserRouter>
  );
}

export default App;
