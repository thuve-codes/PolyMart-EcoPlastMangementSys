import React from "react";
import './Homepage.css';

import ImpactStats from "./Components/ImpactStats";
import Blog from "./Components/Blog";
import FAQ from "./Components/FAQ";

import { useState } from "react";
import distribution from './Assests/images/distribution.png';
import accept from './Assests/images/accept.png';
import deliveryman from './Assests/images/delivery-man.png';
import loading from './Assests/images/loading.png';

import recycle1 from './Assests/images/deliveryyy.png';
import recycle2 from './Assests/images/pic2.jpeg';
import recycle3 from './Assests/images/pic1.jpg';

function HomePage() {
  const [showDescription, setShowDescription] = useState(false);
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>Plastic Recycling Process</h1>
        <p>Join us in making the world a cleaner place by recycling your plastic bottles.</p>
      </header>

      {/* Recycling Process Section */}
      <section className="recycling-info">
        <h2>How Does the Collection Process Work?</h2>
        <p>Our plastic recycling program follows these four simple stages:</p>

        <div className="stages-container">
          {/* Stage 1: Requested */}
          <div className="stage-box">
            <img src={distribution} alt="Request Pickup" />
            <h3>1. Request Pickup</h3>
            <p>You submit a request to recycle your plastic bottles.</p>
          </div>

          {/* Stage 2: Accepted */}
          <div className="stage-box">
          <img src={accept} alt="Request Pickup" />
            <h3>2. Request Accepted</h3>
            <p>Our team reviews and schedules your pickup.</p>
          </div>

          {/* Stage 3: Out for Pickup */}
          <div className="stage-box">
          <img src={deliveryman} alt="Request Pickup" />
            <h3>3. Out for Pickup</h3>
            <p>Our collection team arrives at your location.</p>
          </div>

          {/* Stage 4: Completed */}
          <div className="stage-box">
          <img src={loading} alt="Request Pickup" />
            <h3>4. Recycling Completed</h3>
            <p>Your bottles are collected and sent for recycling.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Start Recycling Today!</h2>
        <p>Every bottle counts. Help us make a difference!</p>
        <button className="cta-button" onClick={() => setShowDescription(!showDescription)}>{showDescription ? "Show Less" : "Learn More"}</button>
        {showDescription && (
          <div className="description-box">
            <p>
              Recycling plastic helps reduce pollution, conserve natural resources, and minimize waste in landfills. 
              By participating in our program, you contribute to a cleaner environment and a sustainable future.
            </p>
          </div>
        )}

        <div className="image-container">
          <img src={recycle1} alt="Recycling Step 1" className="recycle-image" />
          <img src={recycle2} alt="Recycling Step 2" className="recycle-image" />
          <img src={recycle3} alt="Recycling Step 3" className="recycle-image" />
        </div>
      </section>

      <aside className="sidebar">
       
        <ImpactStats />
        <Blog />
        <FAQ />
      </aside>
    </div>
  );
}

export default HomePage;
