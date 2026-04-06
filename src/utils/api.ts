import axios from "axios";


export const authApi = axios.create({
  baseURL: "https://692b1d9e7615a15ff24ec4d9.mockapi.io",
  headers: { "Content-Type": "application/json" },
});


export const countriesApi = axios.create({
  baseURL: "https://6927461426e7e41498fdb2c5.mockapi.io",
  headers: { "Content-Type": "application/json" },
});


// export const hotelsApi = axios.create({
//   baseURL: "https://6927461426e7e41498fdb2c5.mockapi.io",
//   headers: { "Content-Type": "application/json" },
// });

export const flightBookingApi = axios.create({
  baseURL: "https://692b1d9e7615a15ff24ec4d9.mockapi.io",
  headers: { "Content-Type": "application/json" },
});

export const hotelBookingApi = axios.create({
  baseURL: "https://69287bd0b35b4ffc5015daf4.mockapi.io",
  headers: { "Content-Type": "application/json" },
});
