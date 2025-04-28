"use client";

import { updateCategory } from "@/lib/categoriesApi";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  category: {
    id: string;
    name: string;
  } | null;
  onUpdated: () => void;
}

export default function CategoryEditModal({
  isOpen,
  onClose,
  category,
  onUpdated,
}: Props) {
  const [name, setName] = useState(category?.name || "");

  const handleUpdate = async () => {
    if (!category || !name) return;
    await updateCategory(category.id, name);
    onClose();
    onUpdated();
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
        <input
          type="text"
          className="p-2 border border-gray-300 rounded mb-4 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex justify-between">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
