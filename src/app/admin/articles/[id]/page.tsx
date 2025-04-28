"use client";

import { fetchArticleById, updateArticle } from "@/lib/articlesApi";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";

export default function EditArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    async function loadArticle() {
      const data = await fetchArticleById(id as string);
      setTitle(data.title);
      setContent(data.content);
      setCategoryId(data.categoryId);
    }
    loadArticle();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !title || !content || !categoryId) {
      setError("Please fill all the fields.");
      return;
    }

    setError("");
    await updateArticle(id as string, { title, content, categoryId });
    router.push("/admin/articles");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow space-y-6 relative"
    >
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800"
        >
          <IoArrowBack size={24} />
        </button>
        <h2 className="text-2xl font-bold">Edit Article</h2>
      </div>

      {/* Title */}
      <div>
        <label className="block mb-1 font-semibold">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Input title"
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {!title && (
          <p className="text-red-500 text-sm mt-1">Please enter title</p>
        )}
      </div>

      {/* Content */}
      <div>
        <label className="block mb-1 font-semibold">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type content..."
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={8}
        />
        {!content && (
          <p className="text-red-500 text-sm mt-1">
            Content field cannot be empty
          </p>
        )}
      </div>

      {/* Category ID */}
      <div>
        <label className="block mb-1 font-semibold">Category ID</label>
        <input
          type="text"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          placeholder="Input category ID"
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {!categoryId && (
          <p className="text-red-500 text-sm mt-1">Please enter category ID</p>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Bottom Buttons */}
      <div className="flex justify-end space-x-4 pt-6">
        <button
          type="button"
          onClick={() => router.push("/admin/articles")}
          className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
        >
          Update
        </button>
      </div>
    </form>
  );
}
