import React, { useState, useEffect } from 'react';
import { db } from './firebase';

const StockPage = () => {
  const [selectedItem, setSelectedItem] = useState('');
  const [fabricColor, setFabricColor] = useState('');
  const [fabricSize, setFabricSize] = useState('');
  const [stockData, setStockData] = useState([]);
  const [selectedStockItem, setSelectedStockItem] = useState({}); // New state variable for selected stock item

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await db.collection('stock').get();
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStockData(data);
    };
    fetchData();
  }, []);

  const handleItemChange = e => {
    setSelectedItem(e.target.value);
  };

  const handleColorChange = e => {
    setFabricColor(e.target.value);
  };

  const handleSizeChange = e => {
    setFabricSize(e.target.value);
  };

  const handleUpdate = async () => {
    if (!selectedItem || !fabricColor || !fabricSize) {
      return;
    }

    try {
      await db.collection('stock').add({
        item: selectedItem,
        color: fabricColor,
        size: fabricSize
      });

      setSelectedItem('');
      setFabricColor('');
      setFabricSize('');
      // Refresh stock data
      const snapshot = await db.collection('stock').get();
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStockData(data);
    } catch (error) {
      console.error('Error adding stock: ', error);
    }
  };

  const handleDelete = async id => {
    try {
      await db.collection('stock').doc(id).delete();
      // Refresh stock data
      const snapshot = await db.collection('stock').get();
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStockData(data);
    } catch (error) {
      console.error('Error removing stock: ', error);
    }
  };

  const handleEdit = stockItem => {
    setSelectedStockItem(stockItem);
    setFabricColor(stockItem.color);
    setFabricSize(stockItem.size);
  };

  const handleEditUpdate = async () => {
    try {
      await db.collection('stock').doc(selectedStockItem.id).update({
        color: fabricColor,
        size: fabricSize
      });
      setSelectedStockItem({});
      setFabricColor('');
      setFabricSize('');
      // Refresh stock data
      const snapshot = await db.collection('stock').get();
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStockData(data);
    } catch (error) {
      console.error('Error updating stock: ', error);
    }
  };

  return (
    <div>
      <h2>Stock Page</h2>
      <div className="form-group">
        <label htmlFor="item">Item:</label>
        <select id="item" className="form-control" value={selectedItem} onChange={handleItemChange}>
          <option value="">-- Select Item --</option>
          <option value="colors/solids">Colors/Solids</option>
          <option value="allure">Allure</option>
        </select>
      </div>
      {selectedItem === 'colors/solids' && (
        <div>
          <h4>Colors/Solids Stock</h4>
          <table className="table">
            <thead>
              <tr>
                <th>Color</th>
                <th>Size</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {stockData.map(stockItem => (
                <tr key={stockItem.id}>
                  <td>
                    {selectedStockItem.id === stockItem.id ? (
                      <input
                        type="text"
                        className="form-control"
                        value={fabricColor}
                        onChange={handleColorChange}
                      />
                    ) : (
                      stockItem.color
                    )}
                  </td>
                  <td>
                    {selectedStockItem.id === stockItem.id ? (
                      <input
                        type="text"
                        className="form-control"
                        value={fabricSize}
                        onChange={handleSizeChange}
                      />
                    ) : (
                      stockItem.size
                    )}
                  </td>
                  <td>
                    {selectedStockItem.id === stockItem.id ? (
                      <button className="btn btn-primary" onClick={handleEditUpdate}>Save</button>
                    ) : (
                      <button className="btn btn-info" onClick={() => handleEdit(stockItem)}>Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-secondary" onClick={handleUpdate}>Add More</button>
        </div>
      )}
    </div>
  );
};

export default StockPage;
