import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pay from './paybutton';

const YourComponent = () => {
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("${process.env.NEXT_PUBLIC_BE_URI}/api/v1/orderid", {
          amount: "50000"
        }, {
          headers: {
            "Content-Type": "application/json"
          }
        });

        console.log('Response:', response.data);
        setOrderId(response.data.id);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to ensure this effect runs only once on component mount

  return (
    <div>
        <h1>orderId page</h1>
      {orderId && <p>Order ID: {orderId}</p>}
      {/* Your button can be conditionally rendered based on orderId */}
      <button style={{ display: orderId ? 'block' : 'none' }}>Your Button</button>
      <Pay orderId={orderId}/>
    </div>
  );
};

export default YourComponent;
