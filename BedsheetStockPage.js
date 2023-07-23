import React, { useState, useEffect } from "react";
import { db } from "./firebase";

const BedsheetStockPage = () => {
  const [rows, setRows] = useState([{ color: "", size: "", quantity: "", newSizeValue: 0 }]);
  const [stockArr, setStockArr] = useState({});

  const SizeValue = {
    "54x90": 1.5,
    "90x108": 3,
    "108x108": 3.54,
  };

  // Fetch stock data from Firestore on component mount
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const collectionRef = db.collection("FabricStock").doc("Colors210");
        const docSnapshot = await collectionRef.get();
        if (docSnapshot.exists) {
          const stockData = docSnapshot.data();
          setStockArr(stockData);
        } else {
          console.log("Document not found.");
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };
    fetchStockData();
  }, []);

  const handleAddMore = () => {
    setRows([...rows, { color: "", size: "", quantity: "", newSizeValue: 0 }]);
  };

  const handleRemoveRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    if (field === "size") {
      updatedRows[index]["newSizeValue"] = SizeValue[value] || 0;
    }
    setRows(updatedRows);
  };

  const handleSubmit = async () => {
    const newStockUpdate = {};

    rows.forEach((row) => {
      const { color, size, quantity } = row;

      if (color && size && quantity) {
        const parsedQuantity = parseInt(quantity, 10);
        const newSizeValue = SizeValue[size] || 0; // Use 0 if the size is not found in SizeValue

        if (!isNaN(parsedQuantity)) {
          let newStockValue;
          if (parsedQuantity === 1) {
            // Special case for quantity "1"
            newStockValue = stockArr[color] - newSizeValue;
          } else {
            newStockValue = stockArr[color] - newSizeValue * parsedQuantity;
          }
          newStockUpdate[color] = newStockValue;
        } else {
          console.error(`Invalid quantity for ${color}.`);
        }
      } else {
        console.error(`Please fill all required fields for ${color}.`);
      }
    });

    try {
      // Update Firestore data here
      const collectionRef = db.collection("FabricStock").doc("Colors210");
      await collectionRef.update(newStockUpdate);
      console.log("Firestore data updated successfully.");
      setStockArr((prevStockArr) => ({ ...prevStockArr, ...newStockUpdate }));
    } catch (error) {
      console.error("Error updating Firestore data:", error);
    }
  };

  return (
    <>
      <div className="card mt-4">
        <div className="card-header">Master Edit</div>
        <div className="card-body">
          {rows.map((row, index) => (
            <table key={index}>
              <tr>
                <td>
                  <select
                    className="form-select"
                    value={row.color}
                    onChange={(e) => handleInputChange(index, "color", e.target.value)}
                  >
                    <option value="">Select Color</option>
                    <option value="red">Red</option>
                    <option value="green">Green</option>
                    <option value="yellow">Yellow</option>
                  </select>
                </td>
                <td>
                  <select
                    className="form-select"
                    value={row.size}
                    onChange={(e) => handleInputChange(index, "size", e.target.value)}
                  >
                    <option value="">Select Size</option>
                    <option value="54x90">54x90</option>
                    <option value="90x108">90x108</option>
                    <option value="108x108">108x108</option>
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    value={row.quantity}
                    onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                    className="form-control"
                    placeholder="Quantity"
                  />
                </td>
                <td>
                  {index > 0 && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleRemoveRow(index)}
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            </table>
          ))}
          <div className="my-2">
            <button className="btn btn-primary m-2" onClick={handleSubmit}>
              Submit
            </button>
            <button className="btn btn-secondary" onClick={handleAddMore}>
              Add More
            </button>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h3>Updated Stock:</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Color</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stockArr).map(([color, stock]) => (
              <tr key={color}>
                <td>{color}</td>
                <td>{stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BedsheetStockPage;