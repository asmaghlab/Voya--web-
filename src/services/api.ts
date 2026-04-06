const API_URLS = {
  hotels: 'https://6934ceba4090fe3bf020c412.mockapi.io/api/v1/hotels',
  countries: 'https://6927461426e7e41498fdb2c5.mockapi.io/countries',
  users: 'https://692b1d9e7615a15ff24ec4d9.mockapi.io/users',
 hotelbooking: 'https://69287bd0b35b4ffc5015daf4.mockapi.io/bookings/hotelbooking',
 flightbooking:'https://692b1d9e7615a15ff24ec4d9.mockapi.io/flightbooking',
};

export const fetchHotels = async () => {
  const response = await fetch(API_URLS.hotels);
  if (!response.ok) throw new Error('Failed to fetch hotels');
  return response.json();
};

export const fetchCountries = async () => {
  const response = await fetch(API_URLS.countries);
  if (!response.ok) throw new Error('Failed to fetch countries');
  return response.json();
};

export const fetchUsers = async () => {
  const response = await fetch(API_URLS.users);
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};

export const fetchhotelsBookings = async () => {
  const response = await fetch(API_URLS.hotelbooking);
  if (!response.ok) throw new Error('Failed to fetch bookings');
  return response.json();
};


export const fetchflightsBookings = async () => {
  const response = await fetch(API_URLS.flightbooking);
  if (!response.ok) throw new Error('Failed to fetch bookings');
  return response.json();
};
