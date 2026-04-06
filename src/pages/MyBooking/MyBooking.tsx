import React from 'react'
import UserBookings from "../Profile/UserBookings";
import { Helmet } from "react-helmet-async";
export default function MyBooking() {
  return (
    <div className="container mx-auto max-w-7xl space-y-6">
        <Helmet>
                          <title>Voya | MyBooking </title>
                        </Helmet>
        <UserBookings />
    </div>
  )
}
