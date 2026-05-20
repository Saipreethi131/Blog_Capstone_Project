# MyBlog — Frontend (React)

This is the frontend client for the MERN blog application, built using **React**, **Vite**, **Zustand**, and **Tailwind CSS**.

## Project Components

Here is a summary of the React components in the `src/Components/` folder:

* **Header**: Navigation bar containing the isometric brand logo and session routing links (Home, Profile, Login, Logout).
* **Footer**: Clean, Apple-style muted credits and copyright layout.
* **Home**: Welcome landing page with high-end hero sections and call-to-actions.
* **Login**: Login form utilizing React Hook Form and secure Zustand authentication actions.
* **Register**: Unified signup form supporting profile image uploads to Cloudinary.
* **ForgotPassword**: Apple Light styled utility form for secure account password resets.
* **RootLayout**: Global wrapper ensuring dynamic fluid padding on all viewport sizes.
* **ProtectedRoute**: Middleware wrapper securing pages from unauthorized roles or visitors.
* **Unauthorized**: Friendly feedback view shown when a user lacks access rights for a role page.
* **UserProfile**: Dashboard for general readers to view and read all active blog articles.
* **AuthorProfile**: Main dashboard for authors to publish and navigate to their articles.
* **AuthorArticles**: Grid view of all active and soft-deleted articles written by the logged-in author.
* **WriteArticles**: Post editor allowing authors to write and publish new articles.
* **EditArticle**: Editing interface letting authors modify titles and content of existing posts.
* **ArticleByID**: Dedicated article view showing author info, publication timestamps, comment counts, likes, and comment threads.
* **AdminProfile**: High-level panel for system administrators, displaying user stats and user suspension control.

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in this directory and specify the API URL:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```
