
"use client";
import { useState, useEffect ,useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLEBOOK_BOOK;


export default function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [savedBooks, setSavedBooks] = useState([]);
  const debounceTimer = useRef(null);
  const [books, setBooks] = useState([]);

  const [bookCover, setBookCover] = useState([]);
  const params = useParams();
  const name = decodeURIComponent(params.id);

  const categories = [
    "Fiction","Literary Fiction","Classics","Fantasy","Science Fiction","Speculative Fiction","Dystopian","Romance","Historical Fiction","Horror","Thriller","Mystery","Crime","Adventure","Young Adult Fiction","Children's Fiction",
    "Science","Mathematics","Physics","Chemistry","Biology","Astronomy","Computer Science","Computers","Technology","Engineering","Artificial Intelligence","DataScience","Robotics",
    "Health & Fitness","Medical","Mental Health","Nutrition","Diet & Weight Loss","Yoga","Meditation","Self-Help","Personal Development",
    "Business & Economics","Management","Leadership","Marketing","Finance","Investing","Entrepreneurship","Career Development",
    "Art","Design","Architecture","Photography","Music","Performing Arts","Fashion","Film & Television",
    "Religion","Spirituality","Mythology","Social Science","Cultural Studies","Ethics","Law","True Crime",
    "Cooking","Food & Drink","Travel","Sports & Recreation","Games & Activities","Crafts & Hobbies","Gardening","Pets",
    "Juvenile Fiction","Juvenile Nonfiction","Picture Books","Early Learning","Textbooks","Study Guides","Exam Preparation"
  ];



  // Fetch suggestions
  const fetchSuggestions = async (text) => {
    if (!text) return setSuggestions([]);
    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${text}&maxResults=5&key=${API_KEY}`)

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
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`);
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
        `https://www.googleapis.com/books/v1/volumes?q=intitle:${name}&maxResults=1&key=${API_KEY}`
      );
      const data = await res.json();
      const books = data.items?.map((b) => ({
        id: b.id,
        title: b.volumeInfo?.title,
        thumbnail: b.volumeInfo?.imageLinks?.thumbnail,

        publishedDate: b.volumeInfo?.publishedDate,
        authors: b.volumeInfo?.authors?.join(", "),
      })).filter((b) => b.thumbnail) || [];
      setBookCover(books);
    } catch {
      setBookCover([]);
    }
  };

  useEffect(() => {
    BookCover();
  }, []);

  // Genres state
  const [showAll, setShowAll] = useState(false);
  const visibleGenres = showAll ? categories : categories.slice(0, 31);


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
      <nav className="fixed w-full h-16 top-0 z-50 bg-purple-900/90 backdrop-blur-2xl flex items-center justify-evenly px-8 shadow-md">
        <div className="text-2xl text-white tracking-wide">BookShelf</div>

        {/* SEARCH BOX */}
        <div className="bg-white h-full flex items-center gap-2 px-4 py-2 max-w-2xl relative">
          <input
            className="p-4 min-w-0 outline-none"
            placeholder="search books..."
            value={query}
              onChange={(e) => {
                const value = e.target.value;
                setQuery(value);

                if (debounceTimer.current) clearTimeout(debounceTimer.current);

                if (value.length < 2) { 
                  setSuggestions([]);
                  return;
                }
              debounceTimer.current = setTimeout(() => {
                  fetchSuggestions(value);
                }, 500);

}}/>

          <Link  
                href={`/search/${query}`}>
            <img src="/search.png" className="w-5 hover:cursor-pointer hover:scale-105" alt="search" />
            
          </Link>

          <button className="h-9 px-3 w-0.01 text-white text-sm bg-gray-500 rounded-md flex items-center hover:bg-gray-300 hover:cursor-pointer hover:text-black">
            filter
          </button>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-blue-950 shadow-xl z-50">
              {suggestions.slice(0, 5).map((boook) => {
                const info = boook.volumeInfo;
                return (
                  <Link
                    key={boook.id}
                    className="flex gap-3 p-3 hover:bg-[#3a3d5c] cursor-pointer"
                    onClick={() => {
                      setQuery(info.title);
                      setSuggestions([]); 
                    }}
                      href={`/search/${info.title}`}
                   
                  >
                    <img
                        src={info.imageLinks?.thumbnail || "https://via.placeholder.com/80"}
                        alt={info.title}
                        className="w-12 h-16 rounded"
                    />
                    <div className="flex flex-col justify-center text-white">
                        <h3 className="text-sm font-semibold leading-tight">{info.title}</h3>
                        <p className="text-xs text-gray-300 mt-1">{info.authors?.join(", ") || "Unknown Author"}</p>
                        <p className="text-xs text-gray-400 mt-1">{info.publishedDate || "N/A"}</p>
                    </div>
                    </Link>
                );
                })}
            </div>
            )}
        </div>

        <button className="h-9 px-3 text-white text-sm bg-gray-500 rounded-md hover:bg-gray-400 hover:text-black">
            login
        </button>
        </nav>
    {/*MAIN*/}
{/* MAIN */}
<div className="mt-20 flex justify-center items-center min-h-screen px-6">
  {bookCover.map((book) => (
    <div
      key={book.id}
      className="flex flex-col items-center bg-pink-400 p-10 rounded-3xl shadow-2xl"
    >
      {/* FIXED SIZE FRAME */}
      <div className="w-[800px] h-[1000px] bg-white flex items-center justify-center overflow-hidden rounded-2xl shadow-inner">
        <img
          src={book.thumbnail}
          alt={book.title}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* BOOK INFO */}
      <div className="mt-8 text-center text-gray-900">
        <h1 className="text-4xl font-bold">{book.title}</h1>
        <p className="text-xl mt-3">{book.authors}</p>
        <p className="text-lg mt-2">{book.publishedDate}</p>
      </div>
    </div>
  ))}
</div>

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    </div>
    );
}  