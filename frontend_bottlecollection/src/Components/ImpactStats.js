import { useState, useEffect } from "react";
import "./ImpactStats.css";

function ImpactStats() {
  const [bottlesRecycled, setBottlesRecycled] = useState(0);
  const targetValue = 1000000; // Final value to reach
  const duration = 200000;

  useEffect(() => {
    let startTime = Date.now();

    const updateCounter = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(elapsedTime / duration, 1); // Ensure it doesn't exceed 1
      setBottlesRecycled(Math.floor(progress * targetValue));

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);

    return () => cancelAnimationFrame(updateCounter);
  }, []);

  return (
    <div className="impact-section">
      <h2>Our Impact</h2>
      <p><h1><strong>{bottlesRecycled.toLocaleString()}</strong></h1> Bottles recycled so far!</p>
    </div>
  );
}

export default ImpactStats;
