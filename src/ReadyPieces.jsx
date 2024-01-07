import React, { useState, useEffect } from 'react';
import { db } from './firebase';

const ReadyPieces = () => {
  const SizeValue = {
    '90x108': 3,
    '108x108': 3.54,
    '100x108': 3.3,
    '54x90': 1.5,
    'Pillow Cover': 0.36,
  };

  const [styleOptions, setStyleOptions] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [colorData, setColorData] = useState({});

//in the dropdown of these db collection : ReadyStockColors, ReadyStockSolid

  useEffect(() => {
    const fetchStyleOptions = async () => {
      try {
        const collectionRef = db.collection('FabricStock');
        const querySnapshot = await collectionRef.get();
        const optionsArray = querySnapshot.docs.map((doc) => doc.id);
        setStyleOptions(optionsArray);
      } catch (error) {
        console.error('Error fetching style options:', error);
      }
    };
    fetchStyleOptions();
  }, []);

  useEffect(() => {
    const fetchColorData = async () => {
      if (selectedStyle) {
        try {
          const collectionRef = db.collection('FabricStock').doc(selectedStyle);
          const docSnapshot = await collectionRef.get();
          if (docSnapshot.exists) {
            const colorData = docSnapshot.data();
            setColorData(colorData);
          } else {
            console.log(`Document not found for style ${selectedStyle}.`);
          }
        } catch (error) {
          console.error('Error fetching color data:', error);
        }
      } else {
        setColorData({}); // Clear the color data when no style is selected
      }
    };
    fetchColorData();
  }, [selectedStyle]);

  const calculateValue = (valueFromDB, size) => {
    const newSizeValue = SizeValue[size] || 1; // Default size value is 1 if not found in SizeValue
    const calculatedValue = valueFromDB / newSizeValue;
    return Math.floor(calculatedValue);
  };

  return (
    <>
      <div className="card mt-2 card-body">
        <select
          className="form-select"
          value={selectedStyle}
          onChange={(e) => setSelectedStyle(e.target.value)}
        >
          <option value="">Select Style</option>
          {styleOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="card p-3 m-3">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Color</th>
                <th scope="col">90x108</th>
                <th scope="col">100*108</th>
                <th scope="col">108*108</th>
                <th scope="col">55*90</th>
                <th scope="col">Pillow Cover</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(colorData).map(([color, valueFromDB]) => (
                <tr key={color}>
                  <th scope="row">{color}</th>
                  {Object.keys(SizeValue).map((size) => (
                    <td key={size}>{calculateValue(valueFromDB, size)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ReadyPieces;
