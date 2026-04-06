import {
  fetchHotel,
  fetchHotelByCountryId,
} from "@/features/hotels/hotelsSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import HotelPage from "./Hotels";
import { Helmet } from "react-helmet";
import { AppDispatch, RootState } from "@/routes/store";
import { useSearchParams } from "react-router-dom";

export default function HotelWrapper() {
  const dispatch = useDispatch<AppDispatch>();
  // const { countryId } = useParams();
  const [searchParams] = useSearchParams();

  const { hotel, loading, error } = useSelector(
    (state: RootState) => state.hotel
  );

  const countryId = searchParams.get("countryId");
  useEffect(() => {
    if (countryId) {
      dispatch(fetchHotelByCountryId(countryId));
    } else {
      dispatch(fetchHotel());
    }
  }, [dispatch, countryId]);

  return (
    <>
    <Helmet>
        <meta charSet="utf-8" />
        <title>Voya | Hotels</title>
        <link rel="canonical" href="http://mysite.com/Hotels" />
      </Helmet>
    <HotelPage
      hotel={hotel}
      loading={loading}
      error={error}
      countryId={countryId}
    />
    </>
  );
}
