import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/routes/store";
import { fetchCountries, setSearch, setPage } from "@/features/countries/countriesSlice";
import CountryCard from "@/components/travel/CountryCard";
// import CountryCardSkeleton from "@/components/travel/CountryCardSkeleton";
import { FaSearch } from "react-icons/fa";
import HeroSection from '@/components/travel/HeroSection';
import Spinner from './../Flights/FlightsComponents/spinner';
import { Helmet } from "react-helmet";

const CountriesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { countries, loading, error, search, currentPage, itemsPerPage } =
    useSelector((state: RootState) => state.countries);

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  const filteredCountries = useMemo(
    () =>
      countries.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      ),
    [countries, search]
  );

  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCountries.slice(start, start + itemsPerPage);
  }, [filteredCountries, currentPage, itemsPerPage]);

  const handleSearch = (value: string) => {
    dispatch(setSearch(value));
  };

  return (
    <main>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Voya | Countries</title>
      </Helmet>

      <HeroSection
        title="Country"
        dis="Discover breathtaking places around the globe.
            From ancient wonders to modern marvels,"
      />

      <section className="container py-16">
        {/* Search */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search countries..."
              className="w-full rounded-full border border-gray-300 bg-white px-12 py-3 shadow-md placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            {search && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Countries Grid */}
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginated.length > 0 ? (
              paginated.map(
                (country, index) =>
                  country.rating !== undefined &&
                  country.city && (
                    <CountryCard
                      key={country.id}
                      country={country}
                      index={index}
                    />
                  )
              )
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No countries found.
              </p>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredCountries.length > itemsPerPage && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => dispatch(setPage(currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-50"
            >
              Prev
            </button>

            {/* Page Indicator */}
            <span className="text-sm font-medium text-gray-700">
              {currentPage}/{totalPages}
            </span>

            <button
              onClick={() => dispatch(setPage(currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default CountriesPage;
