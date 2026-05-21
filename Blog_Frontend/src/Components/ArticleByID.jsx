import { useParams, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore.js";
import {toast} from 'react-hot-toast'
import {
  articlePageWrapper,
  articleHeader,
  articleCategory,
  articleMainTitle,
  articleAuthorRow,
  authorInfo,
  articleContent,
  articleFooter,
  articleActions,
  editBtn,
  deleteBtn,
  loadingClass,
  errorClass,
  inputClass,
  commentsWrapper,
  commentCard,
  commentHeader,
  commentUserRow,
  avatar,
  commentUser,
  commentTime,
  commentText,
  primaryBtn,
} from "../styles/common.js";
import { useForm } from "react-hook-form";

function ArticleByID() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  const user = useAuth((state) => state.currentUser);
  console.log("user ",user)

  const [article, setArticle] = useState(location.state || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    //if aticle is transferred, then use it
    if (article) return;

    //otherwise, make api req to read that article by id
    const getArticle = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/user-api/article/${id}`, { withCredentials: true });

        setArticle(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.message || err.response?.data?.error || "Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    getArticle();
  }, [id]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // delete & restore article
  const toggleArticleStatus = async () => {
    const newStatus = !article.isArticleActive;

    const confirmMsg = newStatus ? "Restore this article?" : "Delete this article?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/author-api/article`,
        { articleId: article._id, isArticleActive: newStatus },
        { withCredentials: true },
      );

      console.log("SUCCESS:", res.data);

      setArticle(res.data.payload);

      //  toast.success(res.data.message);
    } catch (err) {
      console.log("ERROR:", err.response);

      const msg = err.response?.data?.message;

      if (err.response?.status === 400) {
        toast(msg); // already deleted/active case
      } else {
        setError(msg || "Operation failed");
      }
    }
  };

  //edit article
  const editArticle = (articleObj) => {
    navigate("/edit-article", { state: articleObj });
  };

  //post comment by user
  const addComment = async (commentObj) => {
    //{comment:"user comment"}
    //add artcileId
    commentObj.articleId = article._id;
    try {
      let res = await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/user-api/article`, commentObj, { withCredentials: true });
      if (res.status === 200) {
        setArticle((prev) => ({
          ...prev,
          comments: [...(prev.comments || []), { user: { email: user?.email }, comment: commentObj.comment }],
        }));
        reset({ comment: "" });
        toast.success("Comment added");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like articles");
      return;
    }
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/user-api/article/like`,
        { articleId: article._id },
        { withCredentials: true }
      );
      if (res.status === 200) {
        setArticle(res.data.payload);
        const hasLiked = res.data.payload.likes?.includes(user._id || user.id);
        toast.success(hasLiked ? "Liked article!" : "Unliked article");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to toggle like");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

 // console.log("article",article)


  if (loading) return <p className={loadingClass}>Loading article...</p>;
  if (error) return <p className={errorClass}>{error}</p>;
  if (!article) return null;

  return (
    <div className={articlePageWrapper}>
      {/* Header */}
      <div className={articleHeader}>
        <span className={articleCategory}>{article.category}</span>

        <h1 className={`${articleMainTitle} uppercase`}>{article.title}</h1>

        <div className={articleAuthorRow}>
          <div className={authorInfo}>
            ✍️ {article.author ? `${article.author.firstName} ${article.author.lastName || ""}` : "Author"}
          </div>

          <div>{formatDate(article.createdAt)}</div>
        </div>
      </div>

      {/* Likes & Share Action Bar */}
      <div className="flex items-center gap-3 border-b border-[#e8e8ed] pb-4 mb-8 text-sm">
        {/* LIKE BUTTON */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition duration-200 cursor-pointer ${
            article.likes?.includes(user?._id || user?.id)
              ? "bg-[#ff3b30]/10 border-[#ff3b30]/20 text-[#ff3b30] hover:bg-[#ff3b30]/20"
              : "bg-[#f5f5f7] border-[#e8e8ed] text-[#6e6e73] hover:bg-[#ebebf0] hover:text-[#1d1d1f]"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={article.likes?.includes(user?._id || user?.id) ? "#ff3b30" : "none"}
            stroke={article.likes?.includes(user?._id || user?.id) ? "#ff3b30" : "currentColor"}
            strokeWidth="2"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
          <span className="font-semibold text-xs">{article.likes?.length || 0}</span>
        </button>

        {/* SHARE BUTTON */}
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-full border bg-[#f5f5f7] border-[#e8e8ed] text-[#6e6e73] hover:bg-[#ebebf0] hover:text-[#1d1d1f] transition duration-200 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186l.965.483m-.965-.483a2.25 2.25 0 01-1.07-1.916V7.89a2.25 2.25 0 011.07-1.916m0 0a2.25 2.25 0 100-2.186m0 2.186l.965.483m-.965-.483a2.25 2.25 0 011.07 1.916v3.013a2.25 2.25 0 01-1.07 1.916m0 0a2.25 2.25 0 100 2.186"
            />
          </svg>
          <span className="font-semibold text-xs">Share</span>
        </button>
      </div>

      {/* Content */}
      <div className={articleContent}>{article.content}</div>

      {/* AUTHOR actions */}
      {user?.role === "author" && (
        <div className={articleActions}>
          <button className={editBtn} onClick={() => editArticle(article)}>
            Edit
          </button>

          <button className={deleteBtn} onClick={toggleArticleStatus}>
            {article.isArticleActive ? "Delete" : "Restore"}
          </button>
        </div>
      )}
      {/* form to add comment if role is USER */}
      {/* USER actions */}
      {user?.role === "user" && (
        <div className="mt-8 border-t border-[#e8e8ed] pt-8">
          <h4 className="text-sm font-semibold text-[#1d1d1f] mb-3">Add a public comment</h4>
          <form onSubmit={handleSubmit(addComment)} className="flex flex-col sm:flex-row gap-3 w-full">
            <input
              type="text"
              {...register("comment", { required: true })}
              className={`${inputClass} flex-grow`}
              placeholder="Write your comment here..."
            />
            <button type="submit" className={`${primaryBtn} whitespace-nowrap self-start sm:self-auto`}>
              Add comment
            </button>
          </form>
        </div>
      )}

      {/* GUEST actions */}
      {!user && (
        <div className="mt-8 bg-gradient-to-r from-[#f5f5f7] to-[#ffffff] border border-[#e8e8ed] rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#0066cc]/5 to-transparent rounded-bl-full filter blur-md pointer-events-none" />
          <h4 className="text-base font-bold text-[#1d1d1f]">Join the conversation</h4>
          <p className="text-xs text-[#6e6e73] mt-1.5 max-w-md mx-auto leading-relaxed">
            Sign in to like this article, interact with other readers, and share your perspective.
          </p>
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-[#0066cc] text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-[#004499] shadow-sm hover:shadow cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="border border-[#d2d2d7] text-[#1d1d1f] bg-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-[#f5f5f7] transition cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>
      )}

      {/* comments */}
      {/* Comments */}
      <div className={commentsWrapper}>
        {article.comments?.length === 0 && <p className="text-[#a1a1a6] text-sm text-center">No comments yet</p>}

        {article.comments?.map((commentObj, index) => {
          const name = commentObj.user?.email || "User";
          const firstLetter = name.charAt(0).toUpperCase();

          return (
            <div key={index} className={commentCard}>
              {/* Header */}
              <div className={commentHeader}>
                <div className={commentUserRow}>
                  <div className={avatar}>{firstLetter}</div>

                  <div>
                    <p className={commentUser}>{name}</p>
                    <p className={commentTime}>{formatDate(commentObj.createdAt || new Date())}</p>
                  </div>
                </div>
              </div>

              {/* Comment */}
              <p className={commentText}>{commentObj.comment}</p>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className={articleFooter}>Last updated: {formatDate(article.updatedAt)}</div>
    </div>
  );
}

export default ArticleByID;