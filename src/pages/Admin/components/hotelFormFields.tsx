// HotelFormFields.tsx
import { AddHotelSchemaType } from "@/features/hotels/types";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import FormInput from "./formInput";

interface Props {
  register: UseFormRegister<AddHotelSchemaType>;
  errors: FieldErrors<AddHotelSchemaType>;
  setValue: UseFormSetValue<AddHotelSchemaType>;
  onImageUpload?: (file: File) => void;
}

export default function HotelFormFields({
  register,
  errors,
  setValue,
  onImageUpload,
}: Props) {
return (
  <div className="grid grid-cols-2 gap-4">
    {/* Name */}
    <FormInput label="Hotel Name" error={errors.name?.message}>
      <input
        type="text"
        {...register("name")}
        className="border p-2 rounded w-full"
      />
    </FormInput>

    {/* Country */}
    <FormInput label="Country" error={errors.countryId?.message}>
      <input
        type="text"
        {...register("countryId")}
        className="border p-2 rounded w-full"
      />
    </FormInput>

    {/* City */}
    <FormInput label="City" error={errors.cityId?.message}>
      <input
        type="text"
        {...register("cityId")}
        className="border p-2 rounded w-full"
      />
    </FormInput>

    {/* Price per night */}
    <FormInput label="Price Per Night" error={errors.pricePerNight?.message}>
      <input
        type="number"
        {...register("pricePerNight", { valueAsNumber: true })}
        className="border p-2 rounded w-full"
      />
    </FormInput>

    {/* Stars */}
    <FormInput label="Stars" error={errors.stars?.message}>
      <input
        type="number"
        {...register("stars", { valueAsNumber: true })}
        className="border p-2 rounded w-full"
      />
    </FormInput>

    {/* Rating */}
    <FormInput label="Rating" error={errors.rating?.message}>
      <input
        type="number"
        {...register("rating", { valueAsNumber: true })}
        className="border p-2 rounded w-full"
      />
    </FormInput>

    {/* lat */}
    <FormInput label="lat" error={errors.lat?.message}>
      <input
        type="text"
        {...register("lat")}
        className="border p-2 rounded w-full"
      />
    </FormInput>
    {/* lng */}
    <FormInput label="lng" error={errors.lng?.message}>
      <input
        type="text"
        {...register("lng")}
        className="border p-2 rounded w-full"
      />
    </FormInput>

    {/* phone */}
    <FormInput label="phone" error={errors.phone?.message}>
      <input
        type="string"
        {...register("phone")}
        className="border p-2 rounded w-full"
      />
    </FormInput>

    {/* website */}
    <FormInput label="website" error={errors.website?.message}>
      <input
        type="string"
        {...register("website")}
        className="border p-2 rounded w-full"
      />
    </FormInput>

    {/* Review Count */}
    <FormInput label="Review Count" error={errors.reviewCount?.message}>
      <input
        type="number"
        {...register("reviewCount", { valueAsNumber: true })}
        className="border p-2 rounded w-full"
      />
    </FormInput>

    {/* Currency */}
    <FormInput label="Currency" error={errors.currency?.message}>
      <input
        type="text"
        {...register("currency")}
        className="border p-2 rounded w-full"
      />
    </FormInput>

    {/* Amenities */}
    <FormInput
      label="Amenities (comma separated)"
      error={errors.amenities?.message}
    >
      <input
        type="text"
        {...register("amenities")}
        className="border p-2 rounded w-full"
      />
    </FormInput>

    {/* Address */}
    <FormInput label="Address" error={errors.address?.message}>
      <input
        type="text"
        {...register("address")}
        className="border p-2 rounded w-full"
      />
    </FormInput>

    {/* Neighborhood */}
    <FormInput label="Neighborhood" error={errors.neighborhood?.message}>
      <input
        type="text"
        {...register("neighborhood")}
        className="border p-2 rounded w-full"
      />
    </FormInput>

    {/* Property Type */}
    <FormInput label="Property Type" error={errors.propertyType?.message}>
      <input
        type="text"
        {...register("propertyType")}
        className="border p-2 rounded w-full"
      />
    </FormInput>

    {/* Distance */}
    <FormInput
      label="Distance From Center"
      error={errors.distanceFromCenter?.message}
    >
      <input
        type="text"
        {...register("distanceFromCenter")}
        className="border p-2 rounded w-full"
      />
    </FormInput>

    {/* Check-in */}
    <FormInput label="Check-in Time" error={errors.checkIn?.message}>
      <input
        type="text"
        {...register("checkIn")}
        className="border p-2 rounded w-full"
      />
    </FormInput>

    {/* Check-out */}
    <FormInput label="Check-out Time" error={errors.checkOut?.message}>
      <input
        type="text"
        {...register("checkOut")}
        className="border p-2 rounded w-full"
      />
    </FormInput>

    {/* offers */}
    <FormInput label="offres" error={errors.offers?.message}>
      <input
        type="text"
        {...register("offers")}
        className="border p-2 rounded w-full"
      />
    </FormInput>

    {/* Description (full width) */}
    <div className="col-span-2">
      <FormInput label="Description" error={errors.description?.message}>
        <textarea
          rows={3}
          {...register("description")}
          className="border p-2 rounded w-full"
        ></textarea>
      </FormInput>
    </div>

    <FormInput label="Image" error={errors.images?.message}>
      <input
        type="text"
        {...register("images")}
        className="border p-2 rounded w-full"
      />
    </FormInput>

  </div>
);
}
