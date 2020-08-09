# Twirrer | Backend

Using 'Firebase cloud function' + 'Express.js' to build an API, to handle all operations with database in Twirrer.

## API Documentation:

API-BASE-URL: `https://europe-west3-twirrer-app.cloudfunctions.net/api`

### 1- Posts Endpoints:

- `'/postsFirstFetch'`: retrieve first batch of posts (20 post).
- `'/postsNextFetch'`: retrieve next batch of posts (20 post).
- `'/post/:postId/get'`: retrieve one post (details, likes and comments).
- `'/pinedPost'`: retrieve one post by id, to pinned it at the start in home page.
- `'/addNewPost'`: add new post,
  receive body: {postData}
  receive headers: { Authorization: 'Bearer ' + userToken }
- `'/uploadPostImage'`: add image with post,
  receive body: {formData}
  receive headers: { Authorization: 'Bearer ' + userToken }
- `'/post/:postId/delete'`: delete post by id,
  receive headers: { Authorization: 'Bearer ' + userToken }
- `'/post/:postId/comment'`: add comment to post,
  receive body: {comment}
  receive headers: { Authorization: 'Bearer ' + userToken }
- `'/post/:postId/like'`: like a post,
  receive headers: { Authorization: 'Bearer ' + userToken }
- `'/post/:postId/unlike'`: unlike a post,
  receive headers: { Authorization: 'Bearer ' + userToken }

### 2- User Endpoints:

- `'/login'`: login the user,
  receive body: {userData}
- `'/signup'`: signup the user,
  receive body: {userData}
- `'/getAuthenticatedUser'`: get all data of current auth user (profile data, friends, likes, notifications),
  receive headers: { Authorization: 'Bearer ' + userToken }
- `'/user/:userName/getUserDetails'`: retrieve single user details, to show them in user profile.
- `'/addUserDetails'`: user add extra data to profile like (bio, location, website),
  receive body: {extraUserData}
  receive headers: { Authorization: 'Bearer ' + userToken }
- `'/uploadProfileImage'`: user add new profile image,
  receive body: {formData}
  receive headers: { Authorization: 'Bearer ' + userToken }
- `'/uploadCoverImage'`: user add new cover image,
  receive body: {formData}
  receive headers: { Authorization: 'Bearer ' + userToken }
- `'/user/:userName/addFriend'`: user add another user as friend,
  receive headers: { Authorization: 'Bearer ' + userToken }
- `'/user/:userName/unFriend'`: user delete another user from friends list,
  receive headers: { Authorization: 'Bearer ' + userToken }
- `'/usersToAdd'`: retrieve random user to show them as suggestion friends,
  receive headers: { Authorization: 'Bearer ' + userToken }
- `'/markNotificationsAsRead'`: mark notifications as read, when open notifications tap,
  receive body: {notificationsIds}
  receive headers: { Authorization: 'Bearer ' + userToken }
