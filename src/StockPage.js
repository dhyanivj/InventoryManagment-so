import React, { useState, useEffect } from 'react';
import { db } from './firebase';

const StockPage = () => {
  const [dropdownValue, setDropdownValue] = useState(''); // State for selected dropdown value
  const [stockData, setStockData] = useState([]); // State for the fetched stock data
  const [dropdownOptions, setDropdownOptions] = useState([]); // State for the available dropdown options

  useEffect(() => {
    // Fetch available options from Firestore
    const fetchOptions = async () => {
      try {
        const collectionRef = db.collection('FabricStock');
        const querySnapshot = await collectionRef.get();

        // Map through the query snapshot to create an array of option values
        const optionsArray = querySnapshot.docs.map((doc) => doc.id);
        setDropdownOptions(optionsArray);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    // Fetch stock data from Firestore based on the selected dropdown value
    const fetchData = async () => {
      if (!dropdownValue) {
        // If no dropdown value is selected, set stock data to an empty array
        setStockData([]);
        return;
      }

      try {
        const collectionRef = db.collection('FabricStock').doc(dropdownValue);
        const docSnapshot = await collectionRef.get();

        if (docSnapshot.exists) {
          // Get the data for the selected style from the document snapshot
          const data = docSnapshot.data();
          // Convert the data object into an array of stock data objects
          const stockArray = Object.entries(data).map(([color, stock]) => ({ color, stock }));
          setStockData(stockArray);
        } else {
          // If the document does not exist, set stock data to an empty array
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
                  <button className="btn btn-success">Inward</button>
                </td>
                <td>
                  <button className="btn btn-danger">Outward</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockPage;
