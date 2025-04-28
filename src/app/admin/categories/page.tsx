"use client";

import { useEffect, useState } from "react";
import { fetchCategories } from "@/lib/categoriesApi";
import CategoryCreateModal from "./_components/CategoryCreateModal";
import CategoryEditModal from "./_components/CategoryEditModal";
import CategoryDeleteModal from "./_components/CategoryDeleteModal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

type Category = {
  id: string;
  name: string;
  createdAt: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCategories, setTotalCategories] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  useEffect(() => {
    loadCategories();
  }, [page, search]);

  const loadCategories = async () => {
    const res = await fetchCategories(page, 10, search);
    setCategories(res.data);
    setTotalCategories(res.totalData);
  };

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleOpenEditModal = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };
  const handleOpenDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };
  const handleCloseModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">
          Total Categories: {totalCategories}
        </h1>
        <button
          onClick={handleOpenCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 w-full sm:w-auto"
        >
          + Create
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search categories..."
          className="p-2 border border-gray-300 rounded w-full"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Categories List */}
      {categories.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 whitespace-nowrap">Category</th>
                <th className="p-3 whitespace-nowrap">Created At</th>
                <th className="p-3 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-t">
                  <td className="p-3">{category.name}</td>
                  <td className="p-3">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(category)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(category)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          No categories found.
        </div>
      )}

      {/* Pagination */}
      {totalCategories > 10 && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((prev) => Math.max(prev - 1, 1));
                  }}
                />
              </PaginationItem>

              <PaginationItem>
                <PaginationLink href="#" isActive>
                  {page}
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((prev) => prev + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Modals */}
      <CategoryCreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModals}
        onCreated={loadCategories}
      />
      <CategoryEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        category={selectedCategory}
        onUpdated={loadCategories}
      />
      <CategoryDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        categoryId={selectedCategory?.id ?? null}
        onDeleted={loadCategories}
      />
    </div>
  );
}
