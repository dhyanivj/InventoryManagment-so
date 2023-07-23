import React, { useState, useEffect } from 'react';
import { db } from './firebase';

const ForecastPage = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [stockValue, setStockValue] = useState(50);
  const [purchasedStock, setPurchasedStock] = useState(0);

  useEffect(() => {
    const fetchStockValue = async () => {
      try {
        const snapshot = await db.collection('FabricStock').doc('Colors210').get();
        const data = snapshot.data();
        if (data) {
          setStockValue(data[selectedOption]);
        }
      } catch (error) {
        console.error('Error fetching stock value: ', error);
      }
    };

    if (selectedOption) {
      fetchStockValue();
    }
  }, [selectedOption]);

  const handleSelectChange = e => {
    setSelectedOption(e.target.value);
  };

  const handleInputChange = e => {
    setPurchasedStock(Number(e.target.value));
  };

  const handleUpdateClick = async () => {
    try {
      const newStockValue = stockValue + purchasedStock;
      await db.collection('FabricStock').doc('Colors210').update({
        [selectedOption]: newStockValue
      });
      setStockValue(newStockValue);
      setPurchasedStock(0);
    } catch (error) {
      console.error('Error updating stock: ', error);
    }
  };

  return (
    <>
      <div className='mt-4'>
        <select
          className='form-select'
          aria-label='Default select example'
          value={selectedOption}
          onChange={handleSelectChange}
        >
          <option value=''>Open this select menu</option>
          <option value='red'>Colors 210 - Red</option>
          <option value='green'>Colors 210 - Green</option>
          <option value='yellow'>Colors 210 - Yellow</option>
          <option value='colors210-pink'>Colors 210 - Pink</option>
        </select>
      </div>
      {selectedOption && (
        <div className='card mt-4 shadow' style={{ width: 'max-content' }}>
          <div className='card-header'>{selectedOption}</div>
          <div className='card-body'>
            <h5>
              Current Stock (Meter):{' '}
              <span className='rounded text-white p-2' style={{ background: 'grey' }}>
                {stockValue}
              </span>
            </h5>
            <div className='d-flex gap-2 mt-3'>
              <h5>Purchased Stock: </h5>
              <input
                type='number'
                value={purchasedStock}
                onChange={handleInputChange}
                className='form-control'
              />
            </div>
            <button className='btn btn-primary m-2' onClick={handleUpdateClick}>
              Update Stock
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ForecastPage;
