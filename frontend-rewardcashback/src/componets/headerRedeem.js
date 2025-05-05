import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/images/polymart-logo.png';

function HeaderRedeem() {
  const location = useLocation();

  const navStyles = {
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#f8f9fa',
      boxShadow: '0 2px 4px rgba(89, 32, 32, 0.1)',
      
    },
    logoContainer: {
      height: '50px',
    },
    logo: {
      height: '100%',
    },
    ul: {
      display: 'flex',
      listStyle: 'none',
      margin: 0,
      padding: 0,
    },
    li: {
      margin: '0 1rem',
    },
    link: {
      textDecoration: 'none',
      color: '#333',
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      transition: 'all 0.3s ease',
    },
    activeLink: {
      backgroundColor: '#007bff',
      color: 'white',
    }
  };

  return (
    <nav style={navStyles.navbar}>
      <div style={navStyles.logoContainer}>
        <img src={logo} alt="Polymart Logo" style={navStyles.logo} />
      </div>
      <ul style={navStyles.ul}>
        <li style={navStyles.li}>
          <Link 
            to="/" 
            style={{
              ...navStyles.link,
              ...(location.pathname === '/' && navStyles.activeLink)
            }}
          >
            Home
          </Link>
        </li>
        <li style={navStyles.li}>
          <Link 
            to="/Calculator" 
            style={{
              ...navStyles.link,
              ...(location.pathname === '/Calculator' && navStyles.activeLink)
            }}
          >
            Calculator
          </Link>
        </li>
        <li style={navStyles.li}>
          <Link 
            to="/leaderboard" 
            style={{
              ...navStyles.link,
              ...(location.pathname === '/leaderboard' && navStyles.activeLink)
            }}
          >
            Leaderboard
          </Link>
        </li>
        <li style={navStyles.li}>
          <Link 
            to="/Claim" 
            style={{
              ...navStyles.link,
              ...(location.pathname === '/Claim' && navStyles.activeLink)
            }}
          >
            Claim Redeem
          </Link>
        </li>
        <li style={navStyles.li}>
          <Link 
            to="/Ecolocation" 
            style={{
              ...navStyles.link,
              ...(location.pathname === '/Ecolocation' && navStyles.activeLink)
            }}
          >
            Eco Locations
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default HeaderRedeem;