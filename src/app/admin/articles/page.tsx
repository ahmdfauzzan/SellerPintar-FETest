"use client";

import { useEffect, useState } from "react";
import { fetchArticles } from "@/lib/articlesApi";
import Image from "next/image";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import ArticleDeleteModal from "@/app/admin/articles/_components/ArticleDeleteModal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

type Article = {
  id: string;
  title: string;
  content: string;
  category: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  imageUrl: string | null;
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalArticles, setTotalArticles] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalArticles / itemsPerPage);

  const loadArticles = async (currentPage: number, search = "") => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetchArticles(currentPage, itemsPerPage, search);
      setArticles(res.data);
      setTotalArticles(res.total);
    } catch (err) {
      console.error(err);
      setError("Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles(page, searchQuery);
  }, [page, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to page 1 on search
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleDeleteClick = (articleId: string) => {
    setArticleToDelete(articleId);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow overflow-x-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
        <h1 className="text-xl md:text-2xl font-bold">
          Total Articles : {totalArticles}
        </h1>
        <Link
          href="/admin/articles/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 text-sm md:text-base text-center"
        >
          + Create
        </Link>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row mb-6 items-center gap-4">
        <div className="relative w-full max-w-xs">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by title..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border shadow focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm md:text-base"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8">Loading articles...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full text-left border text-sm md:text-base">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">Thumbnail</th>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Created At</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {articles.length > 0 ? (
                articles.map((article) => (
                  <tr key={article.id} className="border-t">
                    <td className="p-3">
                      {article.imageUrl ? (
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          width={64}
                          height={64}
                          className="object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-300 flex items-center justify-center rounded">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="p-3">{article.title}</td>
                    <td className="p-3">{article.category?.name || "-"}</td>
                    <td className="p-3">
                      {new Date(article.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col md:flex-row gap-2">
                        <Link
                          href={`/admin/articles/${article.id}`}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/admin/articles/preview/${article.id}`}
                          className="text-green-600 hover:underline text-sm"
                        >
                          Preview
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(article.id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No articles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={handlePrev} />
              </PaginationItem>

              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      isActive={page === pageNumber}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext onClick={handleNext} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ArticleDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        articleId={articleToDelete}
        onDeleted={() => loadArticles(page, searchQuery)}
      />
    </div>
  );
}
