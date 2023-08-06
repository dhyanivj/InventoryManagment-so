import React, { useState, useEffect } from 'react';
import { db } from './firebase';

const Popup = ({ quantity, onQuantityChange, onConfirm, onCancel, colorName }) => {
  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Color: {colorName}</h5>
            <button type="button" className="btn-close" onClick={onCancel} />
          </div>
          <div className="modal-body">
            <h2>Enter Quantity</h2>
            <input type="number" value={quantity} onChange={onQuantityChange} />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={onConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StockPage = () => {
  const [dropdownValue, setDropdownValue] = useState('');
  const [stockData, setStockData] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [actionType, setActionType] = useState('');
  const [selectedColorName, setSelectedColorName] = useState('');

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const collectionRef = db.collection('FabricStock');
        const querySnapshot = await collectionRef.get();
        const optionsArray = querySnapshot.docs.map((doc) => doc.id);
        setDropdownOptions(optionsArray);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!dropdownValue) {
        setStockData([]);
        return;
      }

      try {
        const collectionRef = db.collection('FabricStock').doc(dropdownValue);
        const docSnapshot = await collectionRef.get();

        if (docSnapshot.exists) {
          const data = docSnapshot.data();
          const stockArray = Object.entries(data).map(([color, stock]) => ({ color, stock }));
          setStockData(stockArray);
        } else {
          setStockData([]);
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchData();
  }, [dropdownValue]);

  const handleDropdownChange = (event) => {
    setDropdownValue(event.target.value);
  };

  const handleInwardButtonClick = (colorName) => {
    setSelectedColorName(colorName);
    setActionType('inward');
    setShowPopup(true);
  };

  const handleOutwardButtonClick = (colorName) => {
    setSelectedColorName(colorName);
    setActionType('outward');
    setShowPopup(true);
  };

  const handleQuantityChange = (event) => {
    setQuantity(Number(event.target.value));
  };

  const handlePopupConfirm = () => {
    setShowPopup(false);

    if (dropdownValue && quantity !== 0) {
      const currentStockItem = stockData.find((item) => item.color === selectedColorName);

      if (!currentStockItem) {
        console.error('Stock data not found for selected color');
        return;
      }

      const currentStock = currentStockItem.stock;
      let updatedStock;

      if (actionType === 'inward') {
        updatedStock = currentStock + quantity;
      } else if (actionType === 'outward') {
        updatedStock = Math.max(0, currentStock - quantity);
      }

      db.collection('FabricStock')
        .doc(dropdownValue)
        .update({
          [selectedColorName]: updatedStock,
        })
        .then(() => {
          setStockData((prevStockData) =>
            prevStockData.map((item) =>
              item.color === selectedColorName ? { ...item, stock: updatedStock } : item
            )
          );
        })
        .catch((error) => {
          console.error('Error updating stock in database:', error);
        });
    }
  };

  const handlePopupCancel = () => {
    setShowPopup(false);
    setQuantity(0);
  };

  return (
    <div>
      <div className="card p-3 m-4">
        <select
          className="form-select"
          aria-label="Default select example"
          value={dropdownValue}
          onChange={handleDropdownChange}
        >
          <option value="">Select style</option>
          {dropdownOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="card m-4 p-1">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Color</th>
              <th scope="col">Stock</th>
              <th scope="col">Inward</th>
              <th scope="col">Outward</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map((item, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{item.color}</td>
                <td>{item.stock}</td>
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => handleInwardButtonClick(item.color)}
                  >
                    Inward
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleOutwardButtonClick(item.color)}
                  >
                    Outward
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    </div>
  );
};

export default StockPage;
