import { useState } from "react";
import "./FAQ.css";

const faqs = [
  { question: "What plastics can I recycle?", answer: "You can recycle PET and HDPE plastics." },
  { question: "How do I schedule a pickup?", answer: "Request a pickup through our website." },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="faq-section">
      <h3>FAQs</h3>
      {faqs.map((faq, index) => (
        <div key={index} className="faq-item">
          <button onClick={() => setOpenIndex(openIndex === index ? null : index)}>
            {faq.question}
          </button>
          {openIndex === index && <p>{faq.answer}</p>}
        </div>
      ))}
    </div>
  );
}

export default FAQ;
