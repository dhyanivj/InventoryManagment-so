import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
// import { v4 as uuidv4 } from 'uuid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Ecom = () => {
  const [showInward, setShowInward] = useState(false);
  const [showOutward, setShowOutward] = useState(false);
  const [styleOptions, setStyleOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  // const [selectedStyle, setSelectedStyle] = useState('');

  const [formData, setFormData] = useState({
    style: '',
    color: '',
    size: '',
    quantity: '',
  });

  const SizeValue = {
    '54x90': 1.5,
    '90x108': 3,
    '108x108': 3.54,
  };

  useEffect(() => {
    const fetchStyleOptions = async () => {
      try {
        const collectionRef = firebase.firestore().collection('FabricStock');
        const querySnapshot = await collectionRef.get();
        const optionsArray = querySnapshot.docs.map((doc) => doc.id);
        setStyleOptions(optionsArray);
      } catch (error) {
        console.error('Error fetching style options:', error);
      }
    };
    fetchStyleOptions();
  }, []);

  const fetchColorOptions = async (selectedStyle) => {
    try {
      const collectionRef = firebase.firestore().collection('FabricStock').doc(selectedStyle);
      const docSnapshot = await collectionRef.get();
      if (docSnapshot.exists) {
        const colorData = docSnapshot.data();
        const optionsArray = Object.keys(colorData);
        setColorOptions(optionsArray);
      } else {
        console.log(`Document not found for style ${selectedStyle}.`);
      }
    } catch (error) {
      console.error('Error fetching color options:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e, stockType) => {
    e.preventDefault();
    const { style, color, size, quantity } = formData;

    if (!color || !colorOptions.includes(color)) {
      toast.error('Please select a valid color from the dropdown.');
      return;
    }

    try {
      const collectionRef = firebase.firestore().collection('FabricStock').doc(style);
      const docSnapshot = await collectionRef.get();
      if (docSnapshot.exists) {
        const stockData = docSnapshot.data();
        const currentStock = stockData[color] || 0;
        const newSizeValue = SizeValue[size] || 0;
        const parsedQuantity = parseInt(quantity, 10);
        if (!isNaN(parsedQuantity)) {
          let newStockValue = 0;
          if (stockType === 'Inward') {
            newStockValue = currentStock + newSizeValue * parsedQuantity;
          } else if (stockType === 'Outward') {
            newStockValue = currentStock - newSizeValue * parsedQuantity;
          }
          stockData[color] = newStockValue;
          await collectionRef.set(stockData);
          toast.success(`${stockType} stock updated successfully.`);
        } else {
          console.error(`Invalid quantity: ${quantity}`);
          toast.error('Invalid quantity. Please enter a valid number.');
        }
      } else {
        console.log(`Document not found for style ${style}.`);
      }
    } catch (error) {
      console.error(`Error updating ${stockType} stock:`, error);
      toast.error(`Error updating ${stockType} stock.`);
    }
  };

  const handleInwardClick = () => {
    setShowInward(true);
    setShowOutward(false);
  };

  const handleOutwardClick = () => {
    setShowInward(false);
    setShowOutward(true);
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">Fabric Stock Management</h4>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button
                    className={`btn btn-primary ${showInward ? 'active' : ''}`}
                    onClick={handleInwardClick}
                  >
                    Inward
                  </button>
                  <button
                    className={`btn btn-secondary ${showOutward ? 'active' : ''}`}
                    onClick={handleOutwardClick}
                  >
                    Outward
                  </button>
                </div>
                {showInward && (
                  <div className="mt-3">
                    <h5 className="mb-3">Inward stock</h5>
                    <form onSubmit={(e) => handleSubmit(e, 'Inward')}>
                      <div className="mb-3">
                        <select
                          className="form-select"
                          name="style"
                          aria-label="Select Style"
                          onChange={(e) => {
                            handleInputChange(e);
                            fetchColorOptions(e.target.value);
                          }}
                        >
                          <option value="">Select style</option>
                          {styleOptions.map((style) => (
                            <option key={style} value={style}>
                              {style}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <select
                          className="form-select"
                          name="color"
                          aria-label="Select Color"
                          onChange={handleInputChange}
                        >
                          <option value="">Select Color</option>
                          {colorOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <select
                          className="form-select"
                          name="size"
                          aria-label="Select Size"
                          onChange={handleInputChange}
                        >
                          <option value="">Select Size</option>
                          <option value="54x90">54x90</option>
                          <option value="90x108">90x108</option>
                          <option value="108x108">108x108</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <input
                          type="number"
                          name="quantity"
                          className="form-control"
                          placeholder="Quantity"
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="text-end">
                        <button className="btn btn-primary" type="submit">
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                {showOutward && (
                  <div className="mt-3">
                    <h5 className="mb-3">Outward stock</h5>
                    <form onSubmit={(e) => handleSubmit(e, 'Outward')}>
                      <div className="mb-3">
                        <select
                          className="form-select"
                          name="style"
                          aria-label="Select Style"
                          onChange={(e) => {
                            handleInputChange(e);
                            fetchColorOptions(e.target.value);
                          }}
                        >
                          <option value="">Select style</option>
                          {styleOptions.map((style) => (
                            <option key={style} value={style}>
                              {style}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <select
                          className="form-select"
                          name="color"
                          aria-label="Select Color"
                          onChange={handleInputChange}
                        >
                          <option value="">Select Color</option>
                          {colorOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <select
                          className="form-select"
                          name="size"
                          aria-label="Select Size"
                          onChange={handleInputChange}
                        >
                          <option value="">Select Size</option>
                          <option value="54x90">54x90</option>
                          <option value="90x108">90x108</option>
                          <option value="108x108">108x108</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <input
                          type="number"
                          name="quantity"
                          className="form-control"
                          placeholder="Quantity"
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="text-end">
                        <button className="btn btn-primary" type="submit">
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast container to display toast messages */}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
};

export default Ecom;
