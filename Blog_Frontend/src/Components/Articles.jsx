import { useNavigate } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  articleGrid,
  articleCardClass,
  articleTitle,
  ghostBtn,
  loadingClass,
  errorClass,
  timestampClass,
  inputClass,
} from "../styles/common.js";

function Articles() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const getArticles = async () => {
      setLoading(true);
      try {
        let res = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/user-api/articles`,
          { withCredentials: true }
        );
        if (res.status === 200) {
          setArticles(res.data.payload || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.response?.data?.error || "Failed to load articles");
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, []);

  const formatDateIST = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const navigateToArticleByID = (articleObj) => {
    navigate(`/article/${articleObj._id}`, {
      state: articleObj,
    });
  };

  // Get unique categories for filter pills
  const categories = ["All", ...new Set(articles.map((a) => a.category).filter(Boolean))];

  // Filter articles based on category and search query
  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    const matchesSearch =
      article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.author?.firstName + " " + article.author?.lastName)
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <p className={loadingClass}>Loading articles...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 relative">
      {/* Glow backgrounds */}
      <div className="absolute -top-10 right-10 w-[300px] h-[300px] bg-[#0066cc]/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-40 left-0 w-[200px] h-[200px] bg-[#a238ff]/5 rounded-full blur-[80px] pointer-events-none" />

      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#0066cc]/10 text-[#0066cc] uppercase tracking-wider mb-3">
          📚 Articles Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight leading-tight">
          Discover insights & stories
        </h1>
        <p className="text-sm sm:text-base text-[#6e6e73] mt-2 font-normal">
          Explore articles written by our certified creators across technology, science, and life lessons.
        </p>
      </div>

      {/* ERROR */}
      {error && <p className={errorClass + " text-center mb-6"}>{error}</p>}

      {/* SEARCH AND FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white border border-[#e8e8ed] rounded-3xl p-4 mb-8 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            className={`${inputClass} pl-10 pr-4 py-2 w-full text-sm`}
            placeholder="Search articles, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute left-3.5 top-2.5 text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-end w-full md:w-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition border cursor-pointer ${
                selectedCategory === category
                  ? "bg-[#0066cc] border-[#0066cc] text-white"
                  : "bg-white border-[#d2d2d7] text-[#6e6e73] hover:bg-[#f5f5f7] hover:border-[#86868b]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* ARTICLES GRID */}
      {filteredArticles.length === 0 ? (
        <div className="bg-white border border-[#e8e8ed] rounded-3xl p-12 text-center shadow-sm">
          <p className="text-[#a1a1a6] text-sm py-4">No articles match your search or filter</p>
        </div>
      ) : (
        <div className={articleGrid}>
          {filteredArticles.map((articleObj) => (
            <div className={articleCardClass} key={articleObj._id}>
              <div className="flex flex-col h-full">
                {/* Top Section */}
                <div>
                  <div className="flex justify-between items-center w-full mb-1">
                    <span className="text-[0.65rem] font-semibold text-[#0066cc] uppercase tracking-widest">
                      {articleObj.category}
                    </span>
                    <span className="text-[10px] text-[#a1a1a6] font-medium flex items-center gap-1.5">
                      ❤️ {articleObj.likes?.length || 0}
                    </span>
                  </div>

                  <p className={articleTitle}>{articleObj.title}</p>

                  <p className="text-sm text-[#6e6e73] mt-1.5 line-clamp-3">
                    {articleObj.content.slice(0, 100)}...
                  </p>

                  {/* Author detail */}
                  <div className="flex items-center gap-2 mt-4 text-[11px] text-[#86868b]">
                    <span>✍️</span>
                    <span className="font-semibold text-[#1d1d1f]">
                      {articleObj.author
                        ? `${articleObj.author.firstName} ${articleObj.author.lastName || ""}`
                        : "Author"}
                    </span>
                  </div>

                  <p className={`${timestampClass} mt-1.5`}>{formatDateIST(articleObj.createdAt)}</p>
                </div>

                {/* Read Action Button */}
                <button
                  className={`${ghostBtn} mt-auto pt-4 border-t border-dashed border-[#e8e8ed]`}
                  onClick={() => navigateToArticleByID(articleObj)}
                >
                  Read Article →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Articles;