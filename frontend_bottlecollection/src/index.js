import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import HomePage from './Homepage';
import CollectionTracking from './CollectionTracking';
import RewardPoints from './rewardPoints';
import RecyclingCentersPage from './RecyclingCentersPage';
import reportWebVitals from './reportWebVitals';
import PickupForm from './PickupForm';
import RecyclingCenterFinder from './RecyclingCenterFinder';
{/**import RecyclingTrackingPage from './RecyclingTrackingPage'; */}
{/**import PickupStatusPage from './PickupStatusPage'; */}
{/*import RecyclerDashboard from './RecyclerDashboard';  */}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PickupForm/>
    <HomePage/>
    <CollectionTracking/>
    <RewardPoints/>
    <RecyclingCentersPage/>
    <RecyclingCenterFinder/>
    {/**    <RecyclingTrackingPage/> */}
   {/** <PickupStatusPage/> */}
  {/**<RecyclerDashboard/> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
