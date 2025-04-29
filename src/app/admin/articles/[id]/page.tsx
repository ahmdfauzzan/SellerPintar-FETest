"use client";

import { fetchArticleById, updateArticle } from "@/lib/articlesApi";
import { fetchCategories } from "@/lib/categoriesApi";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import instance from "@/lib/axios";
import Image from "next/image";

type Category = {
  id: string;
  name: string;
};

export default function EditArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [isThumbnailRemoved, setIsThumbnailRemoved] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadArticle() {
      const data = await fetchArticleById(id as string);
      setTitle(data.title);
      setContent(data.content);
      setCategoryId(data.categoryId);
      setImageUrl(data.imageUrl || null);
    }

    async function loadCategories() {
      const res = await fetchCategories(1, 10, "");
      setCategories(res.data);
    }

    loadArticle();
    loadCategories();
  }, [id]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setImageUrl(null);
    setIsThumbnailRemoved(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !categoryId) {
      setError("Please fill all the fields.");
      return;
    }

    try {
      setError("");
      let finalImageUrl = imageUrl;

      // Jika user upload file baru, upload ke server
      if (thumbnailFile) {
        const formData = new FormData();
        formData.append("image", thumbnailFile);

        const uploadRes = await instance.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        finalImageUrl = uploadRes.data.imageUrl;
      }

      await updateArticle(id as string, {
        title,
        content,
        categoryId,
        imageUrl: isThumbnailRemoved ? null : finalImageUrl ?? undefined,
      });

      router.push("/admin/articles");
    } catch (err) {
      console.error(err);
      setError("Failed to update article");
    }
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
          <ArrowLeft size={30} />
        </button>
        <h2 className="text-2xl font-bold">Edit Article</h2>
      </div>

      {/* Thumbnail */}
      <div>
        <label className="block mb-1 font-semibold">Thumbnails</label>
        <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center hover:border-blue-400">
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleThumbnailChange}
            className="hidden"
            id="thumbnailInput"
          />
          <label htmlFor="thumbnailInput" className="cursor-pointer">
            {imageUrl ? (
              <div className="flex flex-col items-center space-y-2">
                <Image
                  src={imageUrl}
                  alt="Thumbnail Preview"
                  width={300}
                  height={200}
                  className="mx-auto max-h-40 object-contain"
                />
              </div>
            ) : (
              <div>
                <p className="text-gray-500">Click to select files</p>
                <p className="text-gray-400 text-sm">
                  Support file type: jpg or png
                </p>
              </div>
            )}
          </label>
        </div>
      </div>
      <button
        type="button"
        onClick={handleRemoveThumbnail}
        className="bg-red-500 text-white rounded-lg px-4 py-2 text-sm"
      >
        Delete Thumbnail
      </button>

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

      {/* Category */}
      <div>
        <label className="block mb-1 font-semibold">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select category</option>
          {categories.length > 0 ? (
            categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))
          ) : (
            <option disabled>Loading categories...</option>
          )}
        </select>
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
