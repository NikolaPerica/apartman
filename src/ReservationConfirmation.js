import React from 'react';

const ReservationConfirmation = ({ reservedAccommodation, startDate, endDate, capacity, handleReturnToList }) => {
  return (
    <div>
      <p>Uspješno ste rezervirali smještaj {reservedAccommodation.title}</p>
      <p>Termin boravka: {startDate} - {endDate}</p>
      <p>Broj osoba: {capacity}</p>
      {reservedAccommodation.totalPrice && (
        <p>Ukupna cijena: {reservedAccommodation.totalPrice} €</p>
      )}
      <button onClick={handleReturnToList}>Back to List</button>
    </div>
  );
};

export default ReservationConfirmation;
