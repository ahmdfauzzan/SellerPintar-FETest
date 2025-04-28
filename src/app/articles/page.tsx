"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import HeaderImg from "@/assets/img/headerImg.jpg";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { fetchArticles } from "@/lib/articlesApi";
import { fetchCategories } from "@/lib/categoriesApi";

interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  category: { id: string; name: string };
  user: { username: string };
}

interface Category {
  id: string;
  name: string;
}

export default function ArticlePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const loadArticles = async (search = "", pageNum = 1, categoryId = "") => {
    try {
      setLoading(true);
      const res = await fetchArticles(pageNum, 9, search);
      let data = res.data;

      if (categoryId) {
        data = data.filter(
          (article: Article) => article.category?.id === categoryId
        );
      }

      setArticles(data);
    } catch (error) {
      console.error("Error loading articles", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetchCategories(1, 50);
      setCategories(res.data);
    } catch (error) {
      console.error("Error loading categories", error);
    }
  };

  useEffect(() => {
    loadArticles();
    loadCategories();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadArticles(searchQuery, 1, selectedCategoryId);
      setPage(1);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, selectedCategoryId]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    loadArticles(searchQuery, newPage, selectedCategoryId);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header className="absolute top-0 left-0 w-full z-20 bg-transparent" />

      {/* Search Section */}
      <div className="relative bg-blue-600 py-36 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={HeaderImg}
            alt="Background"
            fill
            className="object-cover w-full h-full opacity-30"
          />
        </div>

        <div className="relative container mx-auto flex flex-col items-center gap-4 z-10">
          <h1 className="text-white text-5xl font-bold text-center">
            The Journal: Design Resources, Interviews, and Industry News
          </h1>
          <p className="text-white text-center text-2xl mb-6">
            Your daily dose of design insights!
          </p>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto bg-blue-500 p-4 rounded-2xl shadow-lg">
            {/* Category Select */}
            <select
              className="w-full md:w-auto bg-white border-none rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md text-gray-700"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full bg-white border-none rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md text-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="container mx-auto px-4 py-10 flex-1">
        {loading ? (
          <div className="text-center">Loading articles...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.length > 0 ? (
              articles.map((article) => (
                <Link key={article.id} href={`/articles/${article.id}`}>
                  <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer h-full flex flex-col">
                    <div className="relative w-full aspect-[4/3] bg-gray-100">
                      {article.imageUrl ? (
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-500 text-sm">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-gray-400 text-xs">
                        {new Date(article.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                      <h3 className="font-bold text-lg mt-2">
                        {article.title}
                      </h3>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {article.category.name}
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-gray-700">
                        By {article.user.username}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center col-span-full">
                No articles found.
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center mt-10">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(page - 1)}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {[...Array(3)].map((_, idx) => {
                const pageNumber = idx + 1;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      isActive={page === pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>

              <PaginationItem>
                <PaginationNext onClick={() => handlePageChange(page + 1)} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      <Footer />
    </div>
  );
}
