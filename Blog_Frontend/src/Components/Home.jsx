import { NavLink } from "react-router";
import { useAuth } from "../store/authStore";

function Home() {
  const { isAuthenticated, currentUser, isCheckingAuth } = useAuth((state) => state);

  // Get dynamic route based on role
  let dashboardPath = "/";
  if (currentUser) {
    if (currentUser.role === "user") dashboardPath = "/user-profile";
    if (currentUser.role === "author") dashboardPath = "/author-profile";
    if (currentUser.role === "admin") dashboardPath = "/admin-profile";
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-16 relative">
      {/* Ambient background glows */}
      <div className="absolute -top-12 -right-12 w-[350px] h-[350px] bg-[#0066cc]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-[250px] h-[250px] bg-[#a238ff]/5 rounded-full blur-[80px] pointer-events-none" />

      {/* HERO BANNER SECTION */}
      <div className="relative overflow-hidden bg-white border border-[#e8e8ed] rounded-3xl p-10 sm:p-14 shadow-sm mb-10 transition hover:shadow-md">
        {/* Subtle decorative gradient/orb overlay */}
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-gradient-to-br from-[#0066cc]/10 to-transparent rounded-bl-full filter blur-xl opacity-50 pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#0066cc]/10 text-[#0066cc] uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc] animate-pulse" />
            Discover & Create
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1d1d1f] tracking-tight leading-[1.1] font-sans">
            Write. Inspire. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#0066cc] via-[#2997ff] to-[#a238ff] bg-clip-text text-transparent">
              Share your story.
            </span>
          </h1>

          <p className="text-lg text-[#6e6e73] mt-6 leading-relaxed font-normal">
            Welcome to the ultimate collaborative publishing arena. Here, readers discover fresh viewpoints daily, and authors craft stories that shape the future.
          </p>

          {isCheckingAuth ? (
            <div className="flex flex-wrap gap-4 mt-8">
              <div className="h-11 w-36 bg-[#e8e8ed] rounded-full animate-pulse"></div>
              <div className="h-11 w-28 bg-[#e8e8ed] rounded-full animate-pulse"></div>
            </div>
          ) : !isAuthenticated ? (
            <div className="flex flex-wrap gap-4 mt-8">
              <NavLink
                to="/articles"
                className="bg-[#0066cc] text-white text-sm font-semibold px-7 py-3 rounded-full hover:bg-[#004499] shadow-sm hover:shadow transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                Explore Articles
              </NavLink>
              <NavLink
                to="/login"
                className="border border-[#d2d2d7] text-[#1d1d1f] bg-white text-sm font-semibold px-7 py-3 rounded-full hover:bg-[#f5f5f7] hover:border-[#86868b] transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                Login
              </NavLink>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 mt-8">
              <NavLink
                to={dashboardPath}
                className="bg-[#0066cc] text-white text-sm font-semibold px-7 py-3 rounded-full hover:bg-[#004499] shadow-sm hover:shadow transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                Go to Dashboard
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {/* CORE FEATURES GRID */}
      <h2 className="text-sm font-semibold text-[#86868b] uppercase tracking-widest mb-6 text-center">
        Explore the Ecosystem
      </h2>

      <div className="grid sm:grid-cols-3 gap-6 mb-12">
        {/* CARD 1 */}
        <div className="group bg-white border border-[#e8e8ed] rounded-3xl p-8 hover:border-[#0066cc]/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="w-12 h-12 rounded-2xl bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2">Curated Reading</h3>
          <p className="text-sm text-[#6e6e73] leading-relaxed">
            Delve into high-quality blogs written by certified creators across diverse niches like technology, science, and life lessons.
          </p>
        </div>

        {/* CARD 2 */}
        <div className="group bg-white border border-[#e8e8ed] rounded-3xl p-8 hover:border-[#a238ff]/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="w-12 h-12 rounded-2xl bg-[#a238ff]/10 text-[#a238ff] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2">Publish Articles</h3>
          <p className="text-sm text-[#6e6e73] leading-relaxed">
            Write content easily with our markdown-optimized text processors, upload stunning covers, and expand your audience globally.
          </p>
        </div>

        {/* CARD 3 */}
        <div className="group bg-white border border-[#e8e8ed] rounded-3xl p-8 hover:border-[#34c759]/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="w-12 h-12 rounded-2xl bg-[#34c759]/10 text-[#34c759] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2">Interactive Feeds</h3>
          <p className="text-sm text-[#6e6e73] leading-relaxed">
            Interact by liking posts, sharing direct URLs with clipboard shortcuts, and exchanging feedback via responsive comments.
          </p>
        </div>
      </div>

      {/* PLATFORM STATISTICS BAR */}
      <div className="bg-gradient-to-r from-[#f5f5f7] to-[#ffffff] border border-[#e8e8ed] rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row justify-around items-center gap-8 text-center">
        <div>
          <h4 className="text-3xl font-bold text-[#1d1d1f]">50+</h4>
          <p className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mt-1">Total Readers</p>
        </div>
        <div className="hidden md:block w-px h-12 bg-[#e8e8ed]" />
        <div>
          <h4 className="text-3xl font-bold text-[#0066cc]">10+</h4>
          <p className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mt-1">Active Authors</p>
        </div>
        <div className="hidden md:block w-px h-12 bg-[#e8e8ed]" />
        <div>
          <h4 className="text-3xl font-bold text-[#a238ff]">25+</h4>
          <p className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mt-1">Blogs Published</p>
        </div>
      </div>
    </section>
  );
}

export default Home;