import { NavLink } from "react-router";

function Home() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <div className="bg-[#f5f5f7] border border-[#e8e8ed] rounded-3xl p-8 sm:p-10">
        <p className="text-xs uppercase tracking-widest text-[#0066cc] font-semibold mb-3">Welcome</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] leading-tight">Share ideas, stories, and learning</h1>
        <p className="text-[#6e6e73] mt-4 max-w-2xl">
          This is a simple blog space where users can read articles and authors can publish content.
          Start by creating an account or login to continue.
        </p>

        <div className="flex flex-wrap gap-3 mt-7">
          <NavLink
            to="/register"
            className="bg-[#0066cc] text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#004499] transition"
          >
            Create Account
          </NavLink>
          <NavLink
            to="/login"
            className="border border-[#d2d2d7] text-[#1d1d1f] text-sm font-medium px-5 py-2.5 rounded-full hover:bg-white transition"
          >
            Login
          </NavLink>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-white border border-[#e8e8ed] rounded-2xl p-4">
          <p className="text-sm font-semibold text-[#1d1d1f]">Read</p>
          <p className="text-sm text-[#6e6e73] mt-1">Explore articles from different categories.</p>
        </div>
        <div className="bg-white border border-[#e8e8ed] rounded-2xl p-4">
          <p className="text-sm font-semibold text-[#1d1d1f]">Write</p>
          <p className="text-sm text-[#6e6e73] mt-1">Authors can publish and manage their posts.</p>
        </div>
        <div className="bg-white border border-[#e8e8ed] rounded-2xl p-4">
          <p className="text-sm font-semibold text-[#1d1d1f]">Discuss</p>
          <p className="text-sm text-[#6e6e73] mt-1">Users can add comments and interact.</p>
        </div>
      </div>
    </section>
  );
}

export default Home;