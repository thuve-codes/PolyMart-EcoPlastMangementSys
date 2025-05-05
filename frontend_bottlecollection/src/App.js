import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
