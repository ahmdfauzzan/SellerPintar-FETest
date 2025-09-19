"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchArticleById, fetchArticles } from "@/lib/articlesApi";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { useFavoriteStore } from "@/store/favoriteStore";

interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  category: {
    id: string;
    name: string;
  };
  user: {
    username: string;
  };
}

export default function ArticleDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [otherArticles, setOtherArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { favorites, addFavorite, removeFavorite, loadFromStorage } =
    useFavoriteStore();

  useEffect(() => {
    loadFromStorage(); // 🔥 load favorites dari localStorage pas pertama render
  }, [loadFromStorage]);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const [articleRes, otherArticlesRes] = await Promise.all([
          fetchArticleById(id as string),
          fetchArticles(1, 3),
        ]);

        setArticle(articleRes);
        setOtherArticles(otherArticlesRes.data);
      } catch (error) {
        console.error("Failed to fetch article or other articles:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!article) {
    return <div className="text-center py-20">Article not found.</div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isFavorite = favorites.some((fav) => fav.id === article.id);

  const handleFavorite = () => {
    if (isFavorite) {
      removeFavorite(article.id);
    } else {
      addFavorite(article);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header className="border-b-gray-500 border-b-2" />

      <main className="flex-1 container mx-auto px-4 py-10">
        {/* Main Article */}
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">{article.title}</h1>
          <p className="text-gray-500 text-sm mb-4">
            {formatDate(article.createdAt)} | {article.category.name} | By{" "}
            {article.user.username}
          </p>

          {article.imageUrl && (
            <div className="relative w-full h-64 md:h-96 mb-6">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}

          <div className="text-lg leading-8 space-y-6">{article.content}</div>

          {/* 🔥 Tombol Favorite */}
          <button
            onClick={handleFavorite}
            className={`mt-6 px-4 py-2 rounded font-semibold transition ${
              isFavorite
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {isFavorite ? "Remove from Favorites ❤️" : "Add to Favorites 🤍"}
          </button>
        </div>

        {/* Other Articles */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Other articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherArticles
              .filter((other) => other.id !== article.id)
              .map((other) => (
                <Link key={other.id} href={`/articles/${other.id}`}>
                  <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer h-full flex flex-col">
                    <div className="relative w-full aspect-[4/3] bg-gray-100">
                      {other.imageUrl ? (
                        <Image
                          src={other.imageUrl}
                          alt={other.title}
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
                        {formatDate(other.createdAt)}
                      </p>
                      <h3 className="font-bold text-lg mt-2">{other.title}</h3>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {other.category.name}
                        </span>
                      </div>

                      <p className="mt-auto text-sm text-gray-700">
                        By {other.user.username}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
