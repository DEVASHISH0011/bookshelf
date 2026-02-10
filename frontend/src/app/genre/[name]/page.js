"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function GenrePage() {
  const params = useParams();
  const name = params.name;

  const [books, setBooks] = useState([]);
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLEBOOK_BOOK;

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${name}&maxResults=24&key=${API_KEY}`
      );
      const data = await res.json();
      setBooks(data.items || []);
    };

    if (name) fetchBooks();
  }, [name]);

  return (
    <div className="min-h-screen bg-purple-900 text-white p-8">
      <h1 className="text-3xl mb-6">{name} Books</h1>

      <div className="grid grid-cols-5 gap-4">
        {books.map((book) => {
          const info = book.volumeInfo;
          return (
            <div key={book.id}>
              <img
                src={info.imageLinks?.thumbnail}
                className="w-full aspect-[2/3] object-cover"
                alt={info.title}
              />
              <p className="text-sm mt-2">{info.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
