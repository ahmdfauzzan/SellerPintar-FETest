"use client";

import { create } from "zustand";

interface Article {
  id: string;
  title: string;
  imageUrl: string | null;
  category: { id: string; name: string };
  user: { username: string };
  createdAt: string;
}

interface FavoriteState {
  favorites: Article[];
  addFavorite: (article: Article) => void;
  removeFavorite: (id: string) => void;
  loadFromStorage: () => void;
}

export const useFavoriteStore = create<FavoriteState>((set) => ({
  favorites: [],
  addFavorite: (article) =>
    set((state) => {
      const updated = [...state.favorites, article];
      if (typeof window !== "undefined") {
        localStorage.setItem("favorites", JSON.stringify(updated));
      }
      return { favorites: updated };
    }),
  removeFavorite: (id) =>
    set((state) => {
      const updated = state.favorites.filter((a) => a.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem("favorites", JSON.stringify(updated));
      }
      return { favorites: updated };
    }),
  loadFromStorage: () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("favorites");
      set({ favorites: stored ? JSON.parse(stored) : [] });
    }
  },
}));
