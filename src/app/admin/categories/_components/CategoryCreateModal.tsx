"use client";

import { createCategory } from "@/lib/categoriesApi";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CategoryCreateModal({
  isOpen,
  onClose,
  onCreated,
}: Props) {
  const [name, setName] = useState("");

  const handleCreate = async () => {
    if (!name) return;
    await createCategory(name);
    setName("");
    onClose();
    onCreated();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Create New Category</h2>
        <input
          type="text"
          placeholder="Category Name"
          className="p-2 border border-gray-300 rounded mb-4 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex justify-between">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
