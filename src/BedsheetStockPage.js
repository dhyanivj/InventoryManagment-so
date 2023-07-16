import React, { useState } from "react";

const BedsheetStockPage = () => {
  const [rows, setRows] = useState(1); // Initial number of rows is 1

  const handleAddMore = () => {
    setRows((prevRows) => prevRows + 1); // Increment the number of rows
  };

  const handleSubmit = () => {
    const selectedValues = [];
    for (let i = 0; i < rows; i++) {
      // Get the selected values for each row
      const select1 = document.getElementById(`select1-${i}`);
      const select2 = document.getElementById(`select2-${i}`);
      const select3 = document.getElementById(`select3-${i}`);
      const select4 = document.getElementById(`select4-${i}`);

      const value1 = select1.options[select1.selectedIndex].value;
      const value2 = select2.options[select2.selectedIndex].value;
      const value3 = select3.options[select3.selectedIndex].value;
      const value4 = select4.options[select4.selectedIndex].value;

      selectedValues.push({ value1, value2, value3, value4 });
    }

    // Show selected values in a popup
    alert(JSON.stringify(selectedValues));
  };

  return (
    <>
      <div className="card mt-4">
        <div className="card-header">Mater edit</div>
        <div className="card-body">
          {Array.from({ length: rows }).map((_, index) => (
            <table key={index}>
              <tr>
                <td>
                  <select id={`select1-${index}`} className="form-select">
                    <option value="solids">Solids</option>
                    <option value="colors">Colors</option>
                    <option value="allure">Allure</option>
                  </select>
                </td>
                <td>
                  <select id={`select2-${index}`} className="form-select">
                    <option value="210">210</option>
                    <option value="300">300</option>
                    <option value="600">600</option>
                  </select>
                </td>
                <td>
                  <select id={`select3-${index}`} className="form-select" >
                    <option value="54x90">54x90</option>
                    <option value="90x108">90x108</option>
                    <option value="108x108">108x108</option>
                  </select>
                </td>
                <td>
                  <select id={`select3-${index}`} className="form-select" >
                    <option value="red">red</option>
                    <option value="green">green</option>
                    <option value="yellow">yellow</option>
                  </select>
                </td>
                <td>
                  <select id={`select4-${index}`} className="form-select">
                    <option value="qunatity">Quantity</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
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
    </>
  );
};

export default BedsheetStockPage;
