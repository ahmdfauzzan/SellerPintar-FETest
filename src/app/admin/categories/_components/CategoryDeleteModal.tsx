"use client";

import { deleteCategory } from "@/lib/categoriesApi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string | null;
  onDeleted: () => void;
}

export default function CategoryDeleteModal({
  isOpen,
  onClose,
  categoryId,
  onDeleted,
}: Props) {
  const handleDelete = async () => {
    if (!categoryId) return;
    await deleteCategory(categoryId);
    onClose();
    onDeleted();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
        <p className="mb-4">Are you sure you want to delete this category?</p>
        <div className="flex justify-between">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
