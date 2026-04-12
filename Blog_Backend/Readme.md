***define schemas and create models***
1.UserTypeSchema
--firstname
--lastname
--email
--password
--profileimageurl
--isUserActive (to do soft delete , can be restored later)

2.ArticleSchema
--author (reference of USER)
--title
--category
--content
--comments(reference of USER)
--isArticleActive(soft delete)

***Implement APIs***
1.User API
2.Article API
3.Author API
4.common API
### create common API for register,login,logout
