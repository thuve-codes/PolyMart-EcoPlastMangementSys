// src/Components/AwarenessArticles.js
import React from "react";
import './AwarenessArticles.css';

import workersImg from "../Assests/images/workers.jpg";
import centersImg from "../Assests/images/centers.jpg";
import awarenessImg from "../Assests/images/awareness.jpg";
import youthImg from "../Assests/images/youth.jpg";

const articles = [
    {
      title: "Unsung Heroes: Recycling Workers",
      image: workersImg,
      content: "Recycling workers are the backbone of the sustainability chain. Day in and day out, they manually sort, clean, and process tons of plastic waste to ensure it ends up in the right recycling streams. These individuals often work in challenging conditions, yet their role is essential to maintaining a cleaner environment. Their diligence not only reduces landfill accumulation but also prevents plastics from entering our oceans and natural ecosystems. Recognizing their contributions and advocating for better safety measures and fair wages is a vital step in improving the recycling industry."
    },
    {
      title: "Recycling Centers: Backbone of Sustainability",
      image: centersImg,
      content: "Recycling centers serve as the processing hubs where collected plastic waste is transformed into raw materials ready for reuse. From shredding to melting and remolding, these facilities operate with precision and scale to keep up with urban waste. They are equipped with sorting technologies and efficient machinery that help maintain the purity of recycled materials. These centers not only reduce the pressure on landfills but also promote circularity — where waste becomes a resource. Supporting the expansion and modernization of these centers is key to scaling up global recycling efforts."
    },
    {
      title: "Spreading Awareness: Community Programs",
      image: awarenessImg,
      content: "Effective recycling starts with informed communities. Our awareness programs are designed to educate households, schools, and businesses about waste segregation, the types of recyclable plastics, and the environmental impact of improper disposal. We host workshops, school visits, and clean-up drives that spark curiosity and action. These programs foster a sense of environmental responsibility and ensure that individuals understand how their daily choices can collectively bring about change. Participation in such programs can empower communities to reduce waste and promote eco-friendly lifestyles."
    },
    {
      title: "Message to the Youth",
      image: youthImg,
      content: "The youth are the changemakers of tomorrow. In a world increasingly burdened by plastic waste, young minds hold the key to innovation and awareness. We encourage students and young adults to take active roles in recycling, sustainability projects, and green startups. Small acts like refusing single-use plastics, promoting peer-to-peer education, and volunteering in clean-up efforts can create ripples of change. We urge young people to explore sustainability as a career path, advocate for greener policies, and use their platforms to amplify environmental causes. Your voice matters — use it wisely and boldly."
    },
  ];
  

function AwarenessArticles() {
  return (
    <section className="newspaper-section">
    <header className="newspaper-header">Recycling News and Insights</header>
    <div className="newspaper-container">
      {articles.map((article, index) => (
        <div className="article" key={index}>
          <h3>{article.title}</h3>
          <img src={article.image} alt={article.title} />
          <p>{article.content}</p>
        </div>
      ))}
    </div>
  </section>
  

  );
}

export default AwarenessArticles;
