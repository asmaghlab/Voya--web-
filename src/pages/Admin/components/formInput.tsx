import React from "react";

export default function FormInput({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <label className="font-medium mb-1">{label}</label>
      {children}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
