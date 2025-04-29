"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchArticleById, fetchArticles } from "@/lib/articlesApi";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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

export default function ArticlePreviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [otherArticles, setOtherArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  return (
    <div className="min-h-screen p-8 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={30} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Preview Articles
            </h1>
          </div>
        </div>

        {/* Article Content */}
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-center">{article.title}</h2>
          <p className="text-center text-gray-500 text-sm">
            {formatDate(article.createdAt)} — Created by {article.user.username}
          </p>

          {article.imageUrl && (
            <div className="relative w-full h-64 md:h-96 my-6">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}

          <div
            className="text-gray-700 leading-8 space-y-6"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Other articles */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-6">Other articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherArticles
                .filter((other) => other.id !== article.id)
                .map((other) => (
                  <Link key={other.id} href={`/articles/${other.id}`}>
                    <div className="flex flex-col h-full border rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer">
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
                        <h4 className="font-bold text-lg mt-2">
                          {other.title}
                        </h4>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {other.category.name}
                          </span>
                        </div>

                        <div className="mt-auto pt-4">
                          <p className="text-sm text-gray-700">
                            By {other.user.username}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
