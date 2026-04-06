import { editHotel } from "@/features/hotels/hotelsSlice";
import {
  addHotelSchema,
  AddHotelSchemaType,
  IHotel,
} from "@/features/hotels/types";
import { Edit, Edit2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import HotelFormFields from "./hotelFormFields";
import { AppDispatch } from "@/routes/store";

export default function EditHotelsDB({ hotel }: { hotel: IHotel }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [falling, setFalling] = useState(false);
  const [fallen, setFallen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const handleDouble = () => {
    if (!fallen) {
      setFalling(true);
      setTimeout(() => {
        setFalling(false);
        setFallen(true);
      }, 1200);
    }
  };

  const handleFix = () => setFallen(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<AddHotelSchemaType>({
    resolver: zodResolver(addHotelSchema),
    defaultValues: {
      ...hotel,
      amenities: hotel.amenities?.join(",") || "",
      offers: hotel.offers?.join(",") || "",
      images: hotel.images?.join(",") || "",
    },
  });

  useEffect(() => {
    reset({
      ...hotel,
      amenities: hotel.amenities?.join(",") || "",
      offers: hotel.offers?.join(",") || "",
      images: hotel.images?.join(",") || "",
    });
  }, [hotel, reset]);

  const onSubmit = async (data: AddHotelSchemaType) => {
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
      await dispatch(editHotel({ id: hotel.id, hotel: payload })).unwrap();

      Swal.fire({
        title: "Edit!",
        text: "The Hotel has been successfully edit.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      reset();
      setOpen(false);
    } catch {
      Swal.fire({
        title: "Error",
        text: "Error updating hotel",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg flex items-center justify-center"
        title="Edit"
      >
        <Edit2 size={14} />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl  max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Hotel</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <HotelFormFields
                register={register}
                errors={errors}
                setValue={setValue}
              />

              <div className="flex justify-end gap-3 pt-4">
                <button
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
