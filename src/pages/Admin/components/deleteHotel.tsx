import { deleteHotel, fetchHotel } from "@/features/hotels/hotelsSlice";
import { AppDispatch } from "@/routes/store";
import { Delete, RemoveFormatting, RemoveFormattingIcon, Trash, Trash2, TrashIcon } from "lucide-react";
import { FaRemoveFormat } from "react-icons/fa";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

interface Iprops {
  id: string ;
  name: string;
}


export default function DeleteHotels({ id, name }: Iprops) {
  const dispatch = useDispatch<AppDispatch>();
  const handleDelete = (id: string ) => {
    Swal.fire({
      title: `Are you sure delete ${name}?`,
      text: "You won’t be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteHotel(id))
          .unwrap()
          .then(() => {
            dispatch(fetchHotel());
            Swal.fire({
              title: "Deleted!",
              text: "The category has been successfully deleted.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
          })
          .catch(() => {
            Swal.fire({
              title: "Error!",
              text: "Something went wrong while deleting the category.",
              icon: "error",
            });
          });
      }
    });
  };
  return (
    <>
      <button
        title="Delete"
        onClick={() => handleDelete(id)}
        className="p-2 bg-red-200 hover:bg-red-300 text-red-800 rounded-lg flex items-center justify-center"
      >
        <Trash2 size={14} />
      </button>
    </>
  );
}