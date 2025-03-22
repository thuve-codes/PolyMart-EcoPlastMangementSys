import { Fragment, useState } from "react";
import ChatPopup from "../components/Chatpopup"; // Ensure the path is correct

const ProductPage = ({ productName, sellerName }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Toggle the popup visibility
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <Fragment>
      <div>
        <h1>Product Details</h1>

        {/* Ensure the button is rendered correctly */}
        <button onClick={togglePopup} style={{ padding: "10px 20px", cursor: "pointer" }}>
          Chat with Seller
        </button>

        {/* Only show the popup if it's open */}
        <ChatPopup
          productName={productName}
          sellerName={sellerName}
          isOpen={isPopupOpen}
          togglePopup={togglePopup}
        />
      </div>
    </Fragment>
  );
};

export default ProductPage;
