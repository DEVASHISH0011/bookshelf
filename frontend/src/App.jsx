import { useState, useEffect } from "react";
import search from "./assets/search.png";

const API_KEY = import.meta.env.VITE_GOOGLEBOOK_BOOK;

export default function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [savedBooks, setSavedBooks] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [bookCover, setBookCover] = useState([]);

  const categories = [
    "fiction",
    "technology",
    "business",
    "science",
    "history",
    "romance",
    "fantasy",
    "self-help",
    "biography",
    "psychology",
  ];

  const randomCategory =
    categories[Math.floor(Math.random() * categories.length)];

  // Fetch suggestions
  const fetchSuggestions = async (text) => {
    if (!text) return setSuggestions([]);

    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${text}&key=${API_KEY}`
      );
      const data = await res.json();
      setSuggestions(data.items || []);
    } catch {
      setSuggestions([]);
    }
  };

  // Search books
  const searchBooks = async () => {
    if (!query) return setSearchedBooks([]);

    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`
      );
      const data = await res.json();
      setSearchedBooks(data.items || []);
    } catch {
      setSearchedBooks([]);
    }
  };

  // Fetch book covers + titles
  const BookCover = async () => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${randomCategory}&orderBy=newest&startIndex=${Math.floor(
          Math.random() * 40
        )}&maxResults=24&key=${API_KEY}`
      );

      const data = await res.json();

      const books =
        data.items
          ?.map((b) => ({
            id: b.id,
            title: b.volumeInfo?.title,
            thumbnail: b.volumeInfo?.imageLinks?.thumbnail,
          }))
          .filter((b) => b.thumbnail) || [];

      setBookCover(books);
    } catch {
      setBookCover([]);
    }
  };

  useEffect(() => {
    BookCover();
  }, []);

  const addBook = (book) => {
    if (!savedBooks.find((b) => b.id === book.id)) {
      setSavedBooks([...savedBooks, book]);
    }
  };

  const removeBook = (book) => {
    setSavedBooks(savedBooks.filter((b) => b.id !== book.id));
  };

  return (
    <div className="min-h-screen bg-purple-900 text-black">
      {/* NAVBAR */}
      <nav className="h-16 bg-purple-300 flex items-center justify-evenly px-8 shadow-md">
        <div className="text-2xl tracking-wide">Books Library</div>

        {/* SEARCH BOX */}
        <div className="bg-white  h-full flex items-center gap-2 px-4 py-2 max-w-2xl relative">
          <input
            className="p-4 min-w-0 outline-none"
            placeholder="search books..."
            value={query}
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);

              if (debounceTimer) clearTimeout(debounceTimer);

              if (value.length < 2) {
                setSuggestions([]);
                return;
              }

              const timer = setTimeout(() => {
                fetchSuggestions(value);
              }, 300);

              setDebounceTimer(timer);
            }}
          />

          <button onClick={searchBooks}>
            <img
              src={search}
              className="w-5 hover:cursor-pointer"
              alt="search"
            />
          </button>
                  <button className="h-9 px-3 w-0.01  text-white text-sm bg-gray-500  rounded-md flex items-center hover:bg-gray-300 hover:cursor-pointer hover:text-black"> filter</button>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-blue-950 shadow-xl z-50">
              {suggestions.slice(0, 5).map((book) => {
                const info = book.volumeInfo;

                return (
                  <div
                    key={book.id}
                    className="flex gap-3 p-3 hover:bg-[#3a3d5c] cursor-pointer"
                    onClick={() => {
                      setQuery(info.title);
                      setSuggestions([]);
                    }}
                  >
                    <img
                      src={
                        info.imageLinks?.thumbnail ||
                        "https://via.placeholder.com/80"
                      }
                      alt={info.title}
                      className="w-12 h-16 rounded"
                    />

                    <div className="flex flex-col justify-center text-white">
                      <h3 className="text-sm font-semibold leading-tight">
                        {info.title}
                      </h3>

                      <p className="text-xs text-gray-300 mt-1">
                        {info.authors?.join(", ") || "Unknown Author"}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {info.publishedDate || "N/A"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button className="h-9 px-3 text-white text-sm bg-gray-500 rounded-md hover:bg-gray-400 hover:text-black">
          login
        </button>
      </nav>

      {/* MAIN */}
      <div className="flex">
        <div className="w-[75%]">
          <nav className="h-12 text-2xl text-amber-100 px-4">Books</nav>

          <div className="px-4">
            <div className="grid grid-cols-5 gap-4 bg-pink-500 p-4">
              {bookCover.map((book) => (
                <div
                  key={book.id}
                  className="flex flex-col items-center"
                >
                  <img
                    src={book.thumbnail}
                    className="w-full h-70 object-cover rounded"
                    alt={book.title}
                  />

                  <p className="text-center text-sm mt-2 text-white line-clamp-2">
                    {book.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-[25%] bg-amber-600 p-4">Left Panel</div>
      </div>
    </div>
  );
}
