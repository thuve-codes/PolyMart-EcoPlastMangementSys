import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/images/polymart-logo.png'; // adjust path based on your project

function HeaderRedeem() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logo} alt="Polymart Logo" className="logo" />
      </div>
      <ul>
        <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
        <li><Link to="/redeem" className={location.pathname === '/redeem' ? 'active' : ''}>Redeem</Link></li>
        <li><Link to="/leaderboard" className={location.pathname === '/leaderboard' ? 'active' : ''}>Leaderboard</Link></li>
        <li><Link to="/notifications" className={location.pathname === '/notifications' ? 'active' : ''}>Notifications</Link></li>
      </ul>
    </nav>
  );
}

export default HeaderRedeem;
