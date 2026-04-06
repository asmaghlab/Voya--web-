import { AddHotel, fetchHotel } from "@/features/hotels/hotelsSlice";
import {
  addHotelDefaultValues,
  addHotelSchema,
  AddHotelSchemaType,
} from "@/features/hotels/types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import HotelFormFields from "./hotelFormFields";
import { log } from "console";
import { AppDispatch } from "@/routes/store";

export default function AddHotelsDB() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
    getValues,
  } = useForm<AddHotelSchemaType>({
    resolver: zodResolver(addHotelSchema),
    defaultValues: addHotelDefaultValues,
  });

  //   const images = watch("images") ?? []; // <-- مهم جدًا

  const onSubmit = async (data: AddHotelSchemaType) => {
    console.log("ggggg");
    const payload = {
      ...data,
      amenities:
        typeof data.amenities === "string"
          ? data.amenities.split(",").map((a) => a.trim())
          : data.amenities,
      offers:
        typeof data.offers === "string"
          ? data.offers.split(",").map((a) => a.trim())
          : data.offers,
      images:
        typeof data.images === "string"
          ? data.images.split(",").map((a) => a.trim())
          : data.images,
    };

    try {
      console.log("payload:", JSON.stringify(payload, null, 2));
      await dispatch(AddHotel({ hotel: payload }));

      console.log("gggggiii");

      Swal.fire({
        title: "Add!",
        text: "The Hotel has been added successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      reset();
      setOpen(false);
      dispatch(fetchHotel());
    } catch {
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while adding the hotel.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
      setOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-[#00c0f5] hover:bg-[#00a0d5] rounded text-white font-semibold"
      >
        + ADD Hotel
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Add Hotel</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <HotelFormFields
                register={register}
                errors={errors}
                setValue={setValue}
              />
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Close
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
