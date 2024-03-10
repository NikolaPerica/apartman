import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Accommodation from './Accommodation';
import ReservationConfirmation from './ReservationConfirmation';

const AccommodationList = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [capacity, setCapacity] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reservedAccommodation, setReservedAccommodation] = useState(null);

  useEffect(() => {
    axios.get('https://api.adriatic.hr/test/accommodation')
      .then(response => {
        setAccommodations(response.data);
        setFilteredAccommodations(response.data);
      })
      .catch(error => {
        console.error('Error fetching accommodations:', error);
      });
  }, []);

  const handleFilter = () => {
    let filtered = accommodations.filter(accommodation => {
      let isAvailable = true;

      if (startDate && endDate) {
        isAvailable = accommodation.availableDates.some(date => {
          const start = new Date(startDate);
          const end = new Date(endDate);
          const dateStart = new Date(date.intervalStart);
          const dateEnd = new Date(date.intervalEnd);
          return start >= dateStart && end <= dateEnd;
        });
      }

      if (capacity && accommodation.capacity < parseInt(capacity)) {
        isAvailable = false;
      }

      if (selectedAmenities.length > 0) {
        selectedAmenities.forEach(amenity => {
          if (!accommodation.amenities[amenity]) {
            isAvailable = false;
          }
        });
      }

      return isAvailable;
    });

    setFilteredAccommodations(filtered);
  };

  const handleResetFilters = () => {
    setFilteredAccommodations(accommodations);
    setStartDate('');
    setEndDate('');
    setCapacity('');
    setSelectedAmenities([]);
  };

  const handleReservation = (accommodation) => {
    setReservationSuccess(true);
    setReservedAccommodation(accommodation);
  };

  const handleReturnToList = () => {
    setReservationSuccess(false);
    setReservedAccommodation(null);
  };

  return (
    <div>
      <h1>Accommodation List</h1>
      {reservationSuccess && reservedAccommodation && (
        <ReservationConfirmation
        reservedAccommodation={reservedAccommodation}
        startDate={startDate}
        endDate={endDate}
        capacity={capacity}
        handleReturnToList={handleReturnToList}
      />
      )}
      {!reservationSuccess && (
        <div>
          <div>
            <label>Start Date: </label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <label>End Date: </label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /> <br /> <br />
            <label>Capacity: </label>
            <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} /> <br /> <br />
            <label>Amenities: </label>
            {Object.keys(accommodations.length > 0 ? accommodations[0].amenities : {}).map((amenity, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  value={amenity}
                  checked={selectedAmenities.includes(amenity)}
                  onChange={(e) => {
                    const amenityValue = e.target.value;
                    setSelectedAmenities((prevSelected) =>
                      prevSelected.includes(amenityValue)
                        ? prevSelected.filter((item) => item !== amenityValue)
                        : [...prevSelected, amenityValue]
                    );
                  }}
                />
                {amenity}
              </label>
            ))} <br /> <br />
            <button onClick={handleFilter}>Filter</button>
            <button onClick={handleResetFilters}>Reset</button> <br /> <br />
          </div>
          {filteredAccommodations.map(accommodation => (
            <Accommodation key={accommodation.id} data={accommodation} onReservation={handleReservation} startDate={startDate} endDate={endDate} capacity={capacity} />
          ))}
        </div>
      )}
      <br />
    </div>
  );
};

export default AccommodationList;
