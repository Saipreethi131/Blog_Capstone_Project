import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "../store/authStore";

import {
  articleGrid,
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  ghostBtn,
  loadingClass,
  errorClass,
  emptyStateClass,
  articleStatusActive,
  articleStatusDeleted,
} from "../styles/common";

function AuthorArticles() {
  const navigate = useNavigate();
  const user = useAuth((state) => state.currentUser);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log("user in author profile", user);

  useEffect(() => {
    if (!user) return;

    const getAuthorArticles = async () => {
      try {
        setLoading(true);
        //read articles of current author
        let res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/author-api/article`, { withCredentials: true });
        if (res.status === 200) {
          setArticles(res.data.payload);
        }
        //update articles state
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.message || err.response?.data?.error || "Failed to fetch articles");
      } finally {
        setLoading(false);
      }
    };

    getAuthorArticles();
  }, [user]);

  const openArticle = (article) => {
    navigate(`/article/${article._id}`, {
      state: article,
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
    });
  };

  if (loading) return <p className={loadingClass}>Loading articles...</p>;
  if (error) return <p className={errorClass}>{error}</p>;

  if (articles.length === 0) {
    return <div className={emptyStateClass}>You haven't published any articles yet.</div>;
  }

  return (
    <div className={articleGrid}>
      {articles.map((article) => (
        <div key={article._id} className={`${articleCardClass} relative flex flex-col`}>
          {/* Status Badge */}
          <span className={article.isArticleActive ? articleStatusActive : articleStatusDeleted}>
            {article.isArticleActive ? "ACTIVE" : "DELETED"}
          </span>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center w-full">
              <p className={articleMeta}>{article.category}</p>
              <span className="text-[10px] text-[#a1a1a6] font-medium flex items-center gap-1.5">
                ❤️ {article.likes?.length || 0}
              </span>
            </div>

            <p className={articleTitle}>{article.title}</p>

            <p className={articleExcerpt}>{article.content.slice(0, 60)}...</p>
          </div>

          <button className={`${ghostBtn} mt-auto pt-4`} onClick={() => openArticle(article)}>
            Read Article →
          </button>
        </div>
      ))}
    </div>
  );
}

export default AuthorArticles;