import {  useState } from "react";
import search from "./assets/search.png"  



const API_KEY = import.meta.env.VITE_GOOGLEBOOK_BOOK

export default function App(){

const[query,setQuery] = useState("")
const[suggestions,setSuggestions] = useState([])
const[searchedBooks,setSearchedBooks] = useState([])
const[savedBooks, setSavedBooks] = useState([])
const [debounceTimer, setDebounceTimer] = useState(null);


//fetch suggestions//
const fetchSuggestions = async(text) =>{
  if(!text) return setSuggestions([])
  try{
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${text}&key=${API_KEY}`)
      const data = await res.json()
      setSuggestions(data.items || [])
  }catch{
      setSuggestions([])
  }        
}
// search Books
const searchBooks = async () => {
  if(!query) return setSearchedBooks([])
  try{
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`)
    const data = await res.json()
    setSearchedBooks(data.items||[])
}catch{
  setSearchedBooks([])
} }  

const addBook = (book) =>{
  if(!savedBooks.find((b)=> b.id === book.id)){
    setSavedBooks([...savedBooks,book])
  }
}

const removebook = (book) =>{
  setSavedBooks(savedBooks.filter((b) => b.id !== book.id))
};
      
return(
  <div className="min-h-screen bg-purple-900 text-black">   
    <nav className="h-12  bg-purple-300 flex items-center justify-evenly px-8 shadow-md">
      <div className=" text-2xl  tracking-wide"
      >Books Library</div>

      {/*searchbox*/}
      <div className=" h-12 bg-white  flex items-center gap-2 px-4 py-2 max-w-md relative  "
      >
        <input className="p-4  m-w-0  outline-none"
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
        <button className="   rounded-b-sm "
        > <img src={search}
        className="w-5 hover:cursor-pointer"></img></button>

        <button className="h-9 px-3 w-0.01  text-white text-sm bg-gray-500  rounded-md flex items-center hover:bg-gray-300 hover:cursor-pointer hover:text-black"> filter</button>

     {/* suggestions */}
{suggestions.length > 0 && (
  <div className="absolute top-full left-0 w-full  bg-blue-950 shadow-xl z-50">
    {suggestions.slice(0, 5).map((book) => {
      const info = book.volumeInfo;

      return (
        <div
          key={book.id}
          className="flex gap-3 p-3 hover:bg-[#3a3d5c] cursor-pointer transition"
          onClick={() => {
            setQuery(info.title);
            setSuggestions([]);
          }}
        >
          {/* Image */}
          <img
            src={
              info.imageLinks.thumbnail
            }
            alt={info.title}
            className="w-12 h-16  rounded"
          />

          {/* Info */}
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

      
      </div><button className="h-9 px-3 w-0.01 text-white text-sm bg-gray-500  rounded-md flex items-center hover:bg-gray-400 hover:cursor-pointer hover:text-black">login</button>
      </nav>

    
</div>
  
)






}