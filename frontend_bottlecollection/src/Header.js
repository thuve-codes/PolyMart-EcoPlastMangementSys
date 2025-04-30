import React from "react";
import logo from './Assests/images/polymart-logo.png';
import './Header.css';
import { Link } from "react-router-dom";
import { FaHome, FaClipboardList, FaMapMarkerAlt, FaTruck, FaTachometerAlt, FaBell } from "react-icons/fa"; // Import icons from React Icons

export default function Header(){
    return(
        <nav className="navbar">
            <img src={logo} alt="Logo" className="logo" />
            <ul className="nav-links">
                <li>
                    <Link to={"./Home"}>
                        <FaHome style={{ marginRight: '8px' }} /> Home
                    </Link>
                </li>
                <li>
                    <Link to={"./PickupForm"}>
                        <FaClipboardList style={{ marginRight: '8px' }} /> Pickup Request
                    </Link>
                </li>
                <li>
                    <Link to={"./RecyclingCenterFinder"}>
                        <FaMapMarkerAlt style={{ marginRight: '8px' }} /> Nearby Locations
                    </Link>
                </li>
                <li>
                    <Link to={"./RecyclingTrackingPage"}>
                        <FaTruck style={{ marginRight: '8px' }} /> Pickup Status
                    </Link>
                </li>
                <li>
                    <Link to={"./RecyclerDashboard"}>
                        <FaTachometerAlt style={{ marginRight: '8px' }} /> Recycler Dashboard
                    </Link>
                </li>
                <li>
                    <Link to={"./PickupStatusPage"}>
                        <FaBell style={{ marginRight: '8px' }} /> Notifications
                    </Link>
                </li>
            </ul>
        </nav>
    )
}
