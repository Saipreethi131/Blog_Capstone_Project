
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import {
  navbarClass,
  navContainerClass,
  navBrandClass,
  navLinksClass,
  navLinkClass,
  navLinkActiveClass,
} from "../styles/common";

function Header() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const user = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // decide profile route based on role
  const getProfilePath = () => {
    if (!user) return "/";

    switch (user.role) {
      case "author":
        return "/author-profile";
      case "admin":
        return "/admin-profile";
      default:
        return "/user-profile";
    }
  };

  return (
    <nav className={navbarClass}>
      <div className={navContainerClass}>

        {/* LOGO */}
        <NavLink to="/" className={`${navBrandClass} flex items-center gap-2.5 group`}>
          <svg
            className="w-6 h-6 group-hover:scale-110 transition-all duration-300"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top Layer (Gradient Diamond representing current page) */}
            <path
              d="M12 2L3 7L12 12L21 7L12 2Z"
              fill="url(#logo-grad)"
            />
            {/* Middle Layer (Blue border representing stacked article) */}
            <path
              d="M3 12L12 17L21 12"
              stroke="#0066cc"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Bottom Layer (Purple border representing database foundation) */}
            <path
              d="M3 17L12 22L21 17"
              stroke="#a238ff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="logo-grad" x1="3" y1="7" x2="21" y2="7" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0066cc" />
                <stop offset="1" stopColor="#a238ff" />
              </linearGradient>
            </defs>
          </svg>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-[#1d1d1f] to-[#5a5a5e] bg-clip-text text-transparent">
            MyBlog
          </span>
        </NavLink>

        <ul className={navLinksClass}>

          {/* HOME */}
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? navLinkActiveClass : navLinkClass
              }
            >
              Home
            </NavLink>
          </li>

          {/* NOT LOGGED IN */}
          {!isAuthenticated && (
            <>
              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive ? navLinkActiveClass : navLinkClass
                  }
                >
                  Register
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? navLinkActiveClass : navLinkClass
                  }
                >
                  Login
                </NavLink>
              </li>
            </>
          )}

          {/* LOGGED IN */}
          {isAuthenticated && (
            <>
              <li>
                <NavLink
                  to={getProfilePath()}
                  className={({ isActive }) =>
                    isActive ? navLinkActiveClass : navLinkClass
                  }
                >
                  Profile
                </NavLink>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-[0.95rem] text-[#ff3b30] hover:text-[#d62c23] transition-colors font-semibold cursor-pointer"
                >
                  Logout
                </button>
              </li>
            </>
          )}

        </ul>
      </div>
    </nav>
  );
}

export default Header;