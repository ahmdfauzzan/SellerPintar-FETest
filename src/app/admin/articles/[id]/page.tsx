"use client";

import { fetchArticleById, updateArticle } from "@/lib/articlesApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type PageProps = {
  params: { id: string };
};

export default function EditArticlePage({ params }: PageProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    async function loadArticle() {
      const data = await fetchArticleById(params.id);
      setTitle(data.title);
      setContent(data.content);
      setCategoryId(data.categoryId);
    }
    loadArticle();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateArticle(params.id, { title, content, categoryId });
    router.push("/admin/articles");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow space-y-6"
    >
      <h2 className="text-2xl font-bold mb-4">Edit Article</h2>

      <div>
        <label className="block mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border p-2 rounded"
          rows={6}
          required
        />
      </div>

      <div>
        <label className="block mb-1">Category ID</label>
        <input
          type="text"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500"
      >
        Update
      </button>
    </form>
  );
}
