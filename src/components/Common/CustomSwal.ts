import Swal from "sweetalert2";



export const showSuccessAlert = (message: string) => {
  Swal.fire({
    icon: "success",
    title: "Success!",
    iconColor: "#1aa9ddff",
    text: message,
    confirmButtonColor: "#585657ff",
    timer: 2000,
    showConfirmButton: false,
  });
};


export const showErrorAlert = (message: string) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
    confirmButtonColor: "#ef4444",
  });
};


export const showConfirmAlert = async (message: string) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#79253D",
    cancelButtonColor: "gray",
    confirmButtonText: "Yes",
  });
  return result.isConfirmed;
};