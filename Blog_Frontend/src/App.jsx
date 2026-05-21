import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./Components/RootLayout";
import Home from "./Components/Home";
import Register from "./Components/Register";
import Login from "./Components/Login";
import ForgotPassword from "./Components/ForgotPassword";
import UserProfile from "./Components/UserProfile";
import Articles from "./Components/Articles";
import AuthorProfile from "./Components/AuthorProfile";
import AuthorArticles from "./Components/AuthorArticles";
import EditArticle from './Components/EditArticle'
import WriteArticles from "./Components/WriteArticles";
import ArticleByID from "./Components/ArticleByID";
import AdminProfile from "./Components/AdminProfile";
import Unauthorized from "./Components/Unauthorized";
import {Toaster} from "react-hot-toast"

function App() {
  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "user-profile",
          element: <UserProfile />,
        },
        {
          path: "articles",
          element: <Articles />,
        },
        {
          path: "author-profile",
          element: <AuthorProfile />,

          children: [
            {
              index: true,
              element: <AuthorArticles />,
            },
            {
              path: "articles",
              element: <AuthorArticles />,
            },
            {
              path: "write-article",
              element: <WriteArticles />,
            },
          ],
        },
        {
          path: "article/:id",
          element: <ArticleByID />,
        },
        {
          path: "edit-article",
          element: <EditArticle />,
        },
        {
          path: "admin-profile",
          element: <AdminProfile />,
        },
        {
          path: "unauthorized",
          element: <Unauthorized />,
        },
      ],
    },
  ]);

  return (
    <div>
        <Toaster position="top-center" reverseOrder={false}/>
  <RouterProvider router={routerObj} />
  </div>)

}

export default App;


