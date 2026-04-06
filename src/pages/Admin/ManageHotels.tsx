import { IHotel } from "@/features/hotels/types";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import EditHotelsDB from "./components/editHotel";
import DeleteHotels from "./components/deleteHotel";
import AddHotelsDB from "./components/addHotel";
import { fetchHotel } from "@/features/hotels/hotelsSlice";
import { AppDispatch, RootState } from "@/routes/store";
import HotelCards from "./components/hotelCard";
import ViewHotelModal from "./components/viewHotel";
export default function ManageHotels() {
  const dispatch = useDispatch<AppDispatch>();
  const { hotel, loading } = useSelector((state: RootState) => state.hotel);

  useEffect(() => {
    dispatch(fetchHotel());
  }, [dispatch]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHotels = hotel.filter(
    (h: IHotel) =>
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.id?.toString().includes(searchTerm) ||
      h.cityId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.countryId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      name: "ID",
      selector: (row: IHotel) => row.id,
      sortable: true,
      width: "80px",
    },

    {
      name: "Image",
      cell: (row: IHotel) => (
        <img
          src={row.images?.[0]}
          alt={row.name}
          width={70}
          height={70}
          className="rounded-lg object-cover"
        />
      ),
      width: "90px",
    },

    {
      name: "Name",
      selector: (row: IHotel) => row.name,
      sortable: true,
      width: "180px",
    },

    {
      name: "Country",
      selector: (row: IHotel) => row.countryId,
      width: "130px",
    },

    {
      name: "City",
      selector: (row: IHotel) => row.cityId,
      width: "130px",
    },

    {
      name: "Price",
      selector: (row: IHotel) =>
        `${row.pricePerNight} ${row.currency ?? "USD"}`,
      sortable: true,
      width: "140px",
    },

    {
      name: "Stars",
      selector: (row: IHotel) => row.stars,
      sortable: true,
      width: "80px",
    },

    {
      name: "Rating",
      selector: (row: IHotel) => row.rating,
      sortable: true,
      width: "90px",
    },

    {
      name: "Reviews",
      selector: (row: IHotel) => row.reviewCount,
      sortable: true,
      width: "110px",
    },

    {
      name: "Amenities",
      selector: (row: IHotel) => row.amenities?.slice(0, 4).join(", ") + "...",
      wrap: true,
      width: "200px",
    },

    {
      name: "Address",
      selector: (row: IHotel) => row.address,
      wrap: true,
      width: "220px",
    },

    {
      name: "Distance",
      selector: (row: IHotel) => row.distanceFromCenter,
      width: "120px",
    },

    {
      name: "Check-in",
      selector: (row: IHotel) => row.checkIn,
      width: "120px",
    },

    {
      name: "Check-out",
      selector: (row: IHotel) => row.checkOut,
      width: "120px",
    },

    {
      name: "Property Type",
      selector: (row: IHotel) => row.propertyType,
      width: "180px",
    },

    {
      name: "Description",
      selector: (row: IHotel) =>
        row.description?.length > 80
          ? row.description.slice(0, 80) + "..."
          : row.description,
      wrap: true,
      width: "260px",
    },

    {
      name: "Action",
      cell: (row: IHotel) => (
        <div className="flex gap-2">
          <ViewHotelModal hotel={row} />
          <EditHotelsDB hotel={row} />
          <DeleteHotels id={row.id} name={row.name} />
        </div>
      ),
      width: "150px",
    },
  ];

  return (
    <main className="min-h-screen p-4 md:p-6 flex flex-col">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <h1 className="text-2xl font-semibold">Hotel Management</h1>
          <div className="flex gap-3 flex-wrap w-full md:w-auto">
            <input
              type="text"
              placeholder="Search Hotels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 rounded border text-black w-full md:w-auto"
            />
            <AddHotelsDB />
          </div>
        </header>

        {/* Table */}
        <div className="w-full bg-white rounded shadow overflow-hidden">
          <div className="overflow-x-auto md:overflow-x-visible max-h-full">
            <DataTable
              columns={columns}
              data={filteredHotels}
              pagination
              progressPending={loading}
              highlightOnHover
              striped
              noHeader={false}
              responsive
              customStyles={{
                table: {
                  style: {
                    width: "100%",
                  },
                },
                headCells: {
                  style: {
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    backgroundColor: "#00c0f5",
                    color: "white",
                    fontWeight: "bold",
                  },
                },
                tableWrapper: {
                  style: {
                    overflowX: "auto",
                  },
                },
                rows: {
                  style: {
                    backgroundColor: "white",
                    color: "black",
                  },
                  stripedStyle: {
                    backgroundColor: "#f1f1f1",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
      {!loading && <HotelCards hotel={filteredHotels} />}
    </main>
  );
}
