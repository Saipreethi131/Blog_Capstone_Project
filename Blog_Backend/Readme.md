Backend notes:

This is the backend for my blog app.
Used stack: Node.js + Express + MongoDB (Mongoose) + JWT + cookies.


1. User model
- firstName
- lastName
- email
- password
- role (user / author / admin)
- profileImageUrl
- isUserActive (for block/activate)

2. Article model
- author (ObjectId ref to user)
- title
- category
- content
- comments (user + comment)
- isArticleActive (soft delete)

3. APIs made
- common-api
	- register
	- login
	- logout
	- change password
- user-api
	- read all active articles
	- add comment
- author-api
	- create article
	- read own articles
	- update own article
	- soft delete/restore own article
- admin-api
	- router connected in server (routes can be added as needed)

4. Security things used
- password hashing with bcrypt
- jwt token stored in httpOnly cookie
- role based middleware (verifyToken)

How to run this backend

1. install packages
npm install

2. add .env values
- PORT
- DB_URL
- SECRET_KEY
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

3. start server
node server.js

Default running on: http://localhost:5000

Extra notes
- CORS is set for frontend on localhost:5173
- Request sample files are there:
	- userRequest.http
	- authorRequest.http
	- adminRequest.http


