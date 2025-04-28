import instance from "@/lib/axios";

export async function fetchArticles(page = 1, limit = 10, title = "") {
    const res = await instance.get("/articles", {
      params: { page, limit, title, sortOrder: "asc", }, 
    });
    return res.data;
  }
  
export async function fetchArticleById(id: string) {
  const res = await instance.get(`/articles/${id}`);
  return res.data;
}

export async function createArticle(data: { title: string; content: string; categoryId: string }) {
  const res = await instance.post("/articles", data);
  return res.data;
}

export async function updateArticle(id: string, data: { title: string; content: string; categoryId: string }) {
  const res = await instance.put(`/articles/${id}`, data);
  return res.data;
}

export async function deleteArticle(id: string) {
  const res = await instance.delete(`/articles/${id}`);
  return res.data;
}
