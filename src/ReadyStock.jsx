// Import necessary modules and components
import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Replace with your actual Firebase configuration
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the Popup component
const Popup = ({ quantity, onQuantityChange, onConfirm, onCancel, colorName }) => {
  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
      {/* ... (same as the Popup component in the StockPage) */}
    </div>
  );
};

// Define the ReadyStockPage component
const ReadyStockPage = () => {
  // State variables
  const [readyStockData, setReadyStockData] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [selectedColorName, setSelectedColorName] = useState('');

  // useEffect to fetch ready stock data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const collectionRef = db.collection('ReadyStockColors'); // Replace with your collection name
        const docSnapshot = await collectionRef.get();

        if (docSnapshot.exists) {
          const data = docSnapshot.data();
          setReadyStockData(data);
        } else {
          setReadyStockData({});
        }
      } catch (error) {
        console.error('Error fetching ready stock data:', error);
      }
    };

    fetchData();
  }, []);

  // Event handler to handle button click and show popup
  const handleButtonClick = (colorName) => {
    setSelectedColorName(colorName);
    setShowPopup(true);
  };

  // Event handler to handle quantity change in the popup
  const handleQuantityChange = (event) => {
    setQuantity(Number(event.target.value));
  };

  // Event handler to handle confirmation in the popup
  const handlePopupConfirm = () => {
    setShowPopup(false);

    if (quantity !== 0) {
      // Perform necessary updates to the Firebase collection
      // (Replace with your actual update logic)

      db.collection('ReadyStockColors') // Replace with your collection name
        .update({
          [selectedColorName]: quantity,
        })
        .then(() => {
          // Update local state or perform other actions if needed

          // Show success toast notification
          toast.success(`${selectedColorName} quantity updated.`, {
            position: 'bottom-right',
          });
        })
        .catch((error) => {
          console.error('Error updating ready stock in database:', error);
        });
    }
  };

  // Event handler to handle cancellation in the popup
  const handlePopupCancel = () => {
    setShowPopup(false);
    setQuantity(0);
  };

  return (
    <div>
      <div className="card m-4 p-1">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Color</th>
                <th scope="col">Quantity</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(readyStockData).map(([color, quantity]) => (
                <tr key={color}>
                  <td>{color}</td>
                  <td>{quantity}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleButtonClick(color)}
                    >
                      Update Quantity
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup component */}
      {showPopup && (
        <Popup
          quantity={quantity}
          onQuantityChange={handleQuantityChange}
          onConfirm={handlePopupConfirm}
          onCancel={handlePopupCancel}
          colorName={selectedColorName}
        />
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default ReadyStockPage;
