import instance from "@/lib/axios";

// Fetch all categories with pagination and search
export async function fetchCategories(
  page: number = 1,
  limit: number = 10,
  search: string = ""
) {
  const res = await instance.get("/categories", {
    params: { page, limit, search },
  });
  return res.data;
}

// Create new category
export async function createCategory(name: string) {
  const res = await instance.post("/categories", { name });
  return res.data;
}

// Update an existing category
export async function updateCategory(id: string, name: string) {
  const res = await instance.put(`/categories/${id}`, { name });
  return res.data;
}

// Delete a category by ID
export async function deleteCategory(id: string) {
  const res = await instance.delete(`/categories/${id}`);
  return res.data;
}
