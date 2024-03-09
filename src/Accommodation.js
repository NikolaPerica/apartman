import React, { useState, useEffect } from 'react';

const Accommodation = ({ data, startDate, endDate, capacity, onReservation }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [totalPrice, setTotalPrice] = useState(null);

  useEffect(() => {
    if (startDate && endDate) {
      const nights = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
      const pricePerNight = data.pricelistInEuros.find(price => {
        const intervalStart = new Date(price.intervalStart);
        const intervalEnd = new Date(price.intervalEnd);
        return new Date(startDate) >= intervalStart && new Date(endDate) <= intervalEnd;
      });
      if (pricePerNight) {
        setTotalPrice(nights * pricePerNight.pricePerNight);
      } else {
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(null);
    }
  }, [startDate, endDate, data, capacity]);

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleReservationClick = () => {
    onReservation({ ...data, totalPrice });
  };

  return (
    <div>
      <img src={data.image} alt={data.title} />
      <h2>{data.title}</h2>
      <p>Capacity: {data.capacity}</p>
      {data.beachDistanceInMeters && <p>Beach Distance: {data.beachDistanceInMeters} meters</p>}
      {showDetails && (
        <div>
          <h3>Amenities:</h3>
          <ul>
            {Object.entries(data.amenities).map(([key, value]) => (
              <li key={key}>{key}: {value.toString()}</li>
            ))}
          </ul>
          <h3>Price List:</h3>
          <ul>
            {data.pricelistInEuros.map(price => (
              <li key={price.intervalStart}>{price.intervalStart} - {price.intervalEnd}: {price.pricePerNight} €</li>
            ))}
          </ul>
          {startDate && endDate && capacity && (
            <div>
              <p>Total Price: {totalPrice} €</p>
              <button onClick={handleReservationClick}>Reserve</button>
            </div>
          )}
        </div>
      )}
      <button onClick={handleToggleDetails}>{showDetails ? 'Hide Details' : 'Show Details'}</button>
    </div>
  );
};

export default Accommodation;
