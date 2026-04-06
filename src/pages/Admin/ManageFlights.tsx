import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable, { TableColumn } from "react-data-table-component";
import { Edit2, Trash2, Eye, X } from "lucide-react";
import FlightCards from "../Flights/FlightsComponents/FlightCardadmin";

export type Flight = {
  id: number;
  airline: string;
  from: string;
  to: string;
  price: number;
  duratuion: string;
  passanger: number;
  country: string;
  city: string;
  image?: string;
  _countryId?: string;
  _cityId?: string;
};

// API shapes
export type APICityFlight = {
  id: number | string;
  airline: string;
  from: string;
  to: string;
  price: number;
  offer?: string;
  passanger: number;
  duratuion: string;
};
export type APICity = { id: string; name: string; flights: APICityFlight[] };
export type APICountry = {
  id: string;
  name: string;
  city: APICity[];
  image?: string;
};

const API_BASE = "https://6927461426e7e41498fdb2c5.mockapi.io";

export default function AdminFlightsDashboard() {
  const [countries, setCountries] = useState<APICountry[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  // modal states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [form, setForm] = useState<Partial<Flight>>({});
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const [modalFlight, setModalFlight] = useState<Flight | null>(null);
  const [deleteFlightModal, setDeleteFlightModal] = useState<Flight | null>(
    null
  );

  const [searchText, setSearchText] = useState("");
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const res = await axios.get<APICountry[]>(`${API_BASE}/countries`);
      setCountries(res.data || []);

      const allFlights: Flight[] = [];
      res.data.forEach((country) =>
        country.city.forEach((city) =>
          city.flights.forEach((f) =>
            allFlights.push({
              id: Number(f.id),
              airline: f.airline,
              from: f.from,
              to: f.to,
              price: Number(f.price),
              duratuion: f.duratuion,
              passanger: Number(f.passanger),
              country: country.name,
              city: city.name,
              image: country.image,
              _countryId: country.id,
              _cityId: city.id,
            })
          )
        )
      );
      setFlights(allFlights);
      setFilteredFlights(allFlights);
    } catch (err) {
      console.error(err);
      alert("Failed to load flights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (!searchText) setFilteredFlights(flights);
    else {
      const lower = searchText.toLowerCase();
      setFilteredFlights(
        flights.filter(
          (f) =>
            f.airline.toLowerCase().includes(lower) ||
            f.from.toLowerCase().includes(lower) ||
            f.to.toLowerCase().includes(lower) ||
            f.country.toLowerCase().includes(lower) ||
            f.city.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchText, flights]);

  const computeNextFlightId = () => {
    const allIds = countries.flatMap((c) =>
      c.city.flatMap((ci) => ci.flights.map((f) => Number(f.id) || 0))
    );
    const max = allIds.length ? Math.max(...allIds) : 0;
    return max + 1;
  };

  // ---------- Add Flight ----------
  const addFlight = async (payload: Partial<Flight>) => {
    try {
      if (!payload.country || !payload.city || !payload.airline) {
        alert("Please fill required fields: Airline, Country, City");
        return;
      }

      let country = countries.find(
        (c) => c.name.toLowerCase() === payload.country!.toLowerCase()
      );

      if (!country) {
        const newCountryPayload: Partial<APICountry> = {
          name: payload.country!,
          image: payload.image || "",
          city: [],
        };
        const createdCountry = await axios.post(
          `${API_BASE}/countries`,
          newCountryPayload
        );
        country = createdCountry.data as APICountry;
        setCountries((prev) => [...prev, country!]);
      }


      let city = country.city.find(
        (c) => c.name.toLowerCase() === payload.city!.toLowerCase()
      );
      if (!city) {
        city = {
          id: payload.city!.toLowerCase().replace(/\s+/g, "-"),
          name: payload.city!,
          flights: [],
        } as APICity;
        country.city.push(city);
      }

      const newFlightId = computeNextFlightId();

      const newFlight: APICityFlight = {
        id: newFlightId,
        airline: payload.airline!,
        from: payload.from || "",
        to: payload.to || "",
        price: Number(payload.price || 0),
        duratuion: payload.duratuion || "",
        passanger: Number(payload.passanger || 1),
        offer: payload.image ? "Has image" : "No offer",
      };

      city.flights.unshift(newFlight);


      await axios.put(`${API_BASE}/countries/${country.id}`, country);

      await fetchCountries();
      closeFormModal();
    } catch (err) {
      console.error(err);
      alert("Failed to add flight. Check console for details.");
    }
  };

  // ---------- Edit Flight ----------
  const editFlight = async (payload: Flight) => {
    try {
      const oldCountry = countries.find((c) =>
        c.city.some((ci) => ci.flights.some((f) => Number(f.id) === payload.id))
      );
      if (!oldCountry) return alert("Original country not found");

      oldCountry.city.forEach((ci) => {
        ci.flights = ci.flights.filter((f) => Number(f.id) !== payload.id);
      });

      let targetCountry = countries.find(
        (c) => c.name.toLowerCase() === payload.country.toLowerCase()
      );
      if (!targetCountry) {
        const created = await axios.post(`${API_BASE}/countries`, {
          name: payload.country,
          image: payload.image || "",
          city: [],
        });
        targetCountry = created.data as APICountry;
        countries.push(targetCountry);
      }

      let targetCity = targetCountry.city.find(
        (ci) => ci.name.toLowerCase() === payload.city.toLowerCase()
      );
      if (!targetCity) {
        targetCity = {
          id: payload.city.toLowerCase().replace(/\s+/g, "-"),
          name: payload.city,
          flights: [],
        };
        targetCountry.city.push(targetCity);
      }

      targetCity.flights.unshift({
        id: payload.id,
        airline: payload.airline,
        from: payload.from,
        to: payload.to,
        price: payload.price,
        duratuion: payload.duratuion,
        passanger: payload.passanger,
        offer: "No offer",
      });


      await axios.put(
        `${API_BASE}/countries/${targetCountry.id}`,
        targetCountry
      );
      if (oldCountry.id !== targetCountry.id) {
        await axios.put(`${API_BASE}/countries/${oldCountry.id}`, oldCountry);
      }

      await fetchCountries();
      closeFormModal();
    } catch (err) {
      console.error(err);
      alert("Failed to edit flight");
    }
  };

  // ---------- Delete ----------
  const confirmDeleteFlight = async () => {
    if (!deleteFlightModal) return;
    const country = countries.find(
      (c) => c.id === deleteFlightModal._countryId
    );
    if (!country) return;
    country.city.forEach((ci) => {
      ci.flights = ci.flights.filter(
        (f) => Number(f.id) !== deleteFlightModal.id
      );
    });
    try {
      await axios.put(`${API_BASE}/countries/${country.id}`, country);
      await fetchCountries();
      setDeleteFlightModal(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete flight");
    }
  };

  // ---------- Modal helpers ----------
  const openAddModal = () => {
    setFormMode("add");
    setForm({});
    setSelectedFlight(null);
    setFormModalOpen(true);
    window.scrollTo({ top: 0 });
  };

  const openEditModal = (flight: Flight) => {
    setFormMode("edit");
    setSelectedFlight(flight);
    setForm({
      airline: flight.airline,
      from: flight.from,
      to: flight.to,
      price: flight.price,
      duratuion: flight.duratuion,
      passanger: flight.passanger,
      country: flight.country,
      city: flight.city,
      image: flight.image,
    });
    setFormModalOpen(true);
    window.scrollTo({ top: 0 });
  };

  const closeFormModal = () => {
    setFormModalOpen(false);
    setForm({});
    setSelectedFlight(null);
    setFormMode("add");
  };

  // ---------- Table columns ----------
  const columns: TableColumn<Flight>[] = [
    { name: "ID", selector: (r) => r.id, width: "60px" },
    { name: "Airline", selector: (r) => r.airline, wrap: true },
    { name: "From", selector: (r) => r.from },
    { name: "To", selector: (r) => r.to },
    { name: "Country", selector: (r) => r.country },
    { name: "City", selector: (r) => r.city },
    { name: "Price", selector: (r) => `$${r.price}` },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-1 justify-end">
          <button
            onClick={() => {
              openEditModal(row);
            }}
            className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg flex items-center justify-center"
            title="Edit"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => setDeleteFlightModal(row)}
            className="p-2 bg-red-200 hover:bg-red-300 text-red-800 rounded-lg flex items-center justify-center"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={() => setModalFlight(row)}
            className="p-2 bg-blue-200 hover:bg-blue-300 text-blue-800 rounded-lg flex items-center justify-center"
            title="View"
          >
            <Eye size={14} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const openViewModal = (flight: Flight) => {
    setModalFlight(flight);
  };

  const openDeleteModal = (flight: Flight) => {
    setDeleteFlightModal(flight);
  };

  return (
    <main className="min-h-screen p-4 md:p-6 flex flex-col">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <h1 className="text-2xl font-semibold">Flights Management</h1>
          <div className="flex gap-3 flex-wrap w-full md:w-auto">
            <input
              type="text"
              placeholder="Search flights..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="px-3 py-2 rounded border text-black w-full md:w-auto"
            />
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-[#00c0f5] hover:bg-[#00a0d5] rounded text-white font-semibold"
            >
              + New Flight
            </button>
          </div>
        </header>

        {/* Table */}
        <div className="w-full bg-white rounded shadow overflow-hidden">
          <div className="overflow-x-auto md:overflow-x-visible max-h-full">
            <DataTable
              columns={columns}
              data={filteredFlights}
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

      {/* ------------------ Form Modal (Add / Edit) ----------------- */}
      {formModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-start md:items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white text-black p-6 rounded-lg w-full max-w-3xl relative">
            <button
              onClick={closeFormModal}
              className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h2 className="font-semibold text-lg mb-2">
              {formMode === "edit" ? "Edit Flight" : "Add Flight"}
            </h2>

            <form
              className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2"
              onSubmit={async (e) => {
                e.preventDefault();

                const required = [
                  "airline",
                  "country",
                  "city",
                  "from",
                  "to",
                ] as const;
                for (const key of required) {
                  if (!form[key as keyof Flight]) {
                    alert(`Please fill ${key}`);
                    return;
                  }
                }

       
                const urlRegex = /^(https?:\/\/[^\s]+)$/;
                const onlyText = /^[A-Za-z ]+$/;
                const minLen = /^.{3,}$/;
                const onlyNumbers = /^[0-9]+$/;

                if (
                  !form.airline ||
                  !onlyText.test(form.airline) ||
                  !minLen.test(form.airline)
                ) {
                  alert(
                    "Airline must contain letters only and at least 3 characters"
                  );
                  return;
                }
                if (
                  !form.country ||
                  !onlyText.test(form.country) ||
                  !minLen.test(form.country)
                ) {
                  alert(
                    "Country must contain letters only and at least 3 characters"
                  );
                  return;
                }
                if (
                  !form.city ||
                  !onlyText.test(form.city) ||
                  !minLen.test(form.city)
                ) {
                  alert(
                    "City must contain letters only and at least 3 characters"
                  );
                  return;
                }
                if (
                  !form.from ||
                  !onlyText.test(form.from) ||
                  !minLen.test(form.from)
                ) {
                  alert(
                    "From must contain letters only and at least 3 characters"
                  );
                  return;
                }
                if (
                  !form.to ||
                  !onlyText.test(form.to) ||
                  !minLen.test(form.to)
                ) {
                  alert(
                    "To must contain letters only and at least 3 characters"
                  );
                  return;
                }

                if (!form.image || form.image.trim() === "") {
                  alert("Image URL is required");
                  return;
                }
                if (!urlRegex.test(String(form.image))) {
                  alert(
                    "Image must be a valid URL (starting with http or https)"
                  );
                  return;
                }

                if (!form.price || !onlyNumbers.test(String(form.price))) {
                  alert("Price must be numbers only");
                  return;
                }

                const durationRegex = /^[0-9a-zA-Z ]+$/;

                if (
                  !form.duratuion ||
                  !durationRegex.test(String(form.duratuion))
                ) {
                  alert("Duration can contain numbers and letters (2h 35m)");
                  return;
                }

                if (formMode === "add") {
                  await addFlight(form);
                } else if (formMode === "edit" && selectedFlight) {
                  const payload: Flight = {
                    ...selectedFlight,
                    airline: String(form.airline || selectedFlight.airline),
                    from: String(form.from || selectedFlight.from),
                    to: String(form.to || selectedFlight.to),
                    price: Number(
                      typeof form.price !== "undefined"
                        ? form.price
                        : selectedFlight.price
                    ),
                    duratuion: String(
                      form.duratuion || selectedFlight.duratuion
                    ),
                    passanger: Number(
                      typeof form.passanger !== "undefined"
                        ? form.passanger
                        : selectedFlight.passanger
                    ),
                    country: String(form.country || selectedFlight.country),
                    city: String(form.city || selectedFlight.city),
                    image: form.image || selectedFlight.image,
                    id: selectedFlight.id,
                    _countryId: selectedFlight._countryId,
                    _cityId: selectedFlight._cityId,
                  };
                  await editFlight(payload);
                }
              }}
            >
              {[
                { label: "Airline", key: "airline" },
                { label: "From", key: "from" },
                { label: "To", key: "to" },
                { label: "Country", key: "country" },
                { label: "City", key: "city" },
                { label: "Price", key: "price", type: "number" },
                { label: "Duration", key: "duratuion" },
                { label: "Passengers", key: "passanger", type: "number" },
                { label: "Image URL", key: "image" },
              ].map((field) => (
                <div key={field.key} className="flex flex-col">
                  <label className="text-sm font-medium">{field.label}</label>
                  <input
                    type={field.type || "text"}
                    placeholder={field.label}
                    value={
                      typeof form[field.key as keyof Flight] !== "undefined"
                        ? (form[field.key as keyof Flight] as any)
                        : ""
                    }
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        [field.key]:
                          field.type === "number"
                            ? e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                            : e.target.value,
                      }))
                    }
                    className="px-3 py-2 border rounded w-full"
                  />
                </div>
              ))}

              <div className="md:col-span-3 flex flex-wrap justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="px-4 py-2 bg-gray-400 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00c0f5] hover:bg-[#00a0d5] text-white rounded"
                >
                  {formMode === "edit" ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------ View Modal ------------------ */}
      {modalFlight && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white text-black p-6 rounded-lg w-full max-w-xl relative overflow-visible">
            <button
              onClick={() => setModalFlight(null)}
              className="absolute top-3 right-3 p-1 rounded hover:bg-gray-200"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Flight Details</h2>
            <div className="space-y-2">
              <p>
                <strong>Airline:</strong> {modalFlight.airline}
              </p>
              <p>
                <strong>From:</strong> {modalFlight.from}
              </p>
              <p>
                <strong>To:</strong> {modalFlight.to}
              </p>
              <p>
                <strong>Country:</strong> {modalFlight.country}
              </p>
              <p>
                <strong>City:</strong> {modalFlight.city}
              </p>
              <p>
                <strong>Price:</strong> ${modalFlight.price}
              </p>
              <p>
                <strong>Duration:</strong> {modalFlight.duratuion}
              </p>
              <p>
                <strong>Passengers:</strong> {modalFlight.passanger}
              </p>
              {modalFlight.image && (
                <img
                  src={modalFlight.image}
                  alt="Flight"
                  className="mt-3 rounded w-full object-cover"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------ Delete Confirmation Modal ------------------ */}
      {deleteFlightModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white text-black p-6 rounded-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Delete Flight</h2>
            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteFlightModal.airline}</strong> flight?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setDeleteFlightModal(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteFlight}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {!loading && (
        <FlightCards
          flights={filteredFlights}
          onEdit={(f) => openEditModal(f)}
          onDelete={(f) => setDeleteFlightModal(f)}
          onView={(f) => setModalFlight(f)}
        />
      )}
    </main>
  );
}
