/**
 * this schema will not be user in thi app,
 * this is just to give you quick look of how the database look.
 */

let DB_schema = {
  users: [{
    userId: 'dh23ggj5h32g543j5gf43',
    email: 'user@email.com',
    userName: 'user',
    createdAt: '2019-03-15T10:59:52.798Z',
    profilePicture: 'https://firebasestorage.googleapis.com/v0/b/twirrer-app.appspot.com/o/750854615984.png?alt=media',
    coverPicture: 'https://firebasestorage.googleapis.com/v0/b/twirrer-app.appspot.com/o/750854615984.png?alt=media',
    bio: 'Hello, my name is user, nice to meet you',
    website: 'https://user.com',
    location: 'Berlin, DE',
    friendsCount: 0
  }],
  posts: [{
    postContent: "Hi friends!",
    postImage: "https://firebasestorage.googleapis.com/v0/b/twirrer-app.appspot.com/o/750854615984.png?alt=media",
    createdAt: "2020-06-16T20:46:50.192Z",
    likeCount: 5,
    commentCount: 3,
    profilePicture: "https://firebasestorage.googleapis.com/v0/b/twirrer-app.appspot.com/o/750854615984.png?alt=media",
    userId: "563xm6hNAuMmmdKb5e54jvynNiR2",
    userName: "user"
  }],
  comments: [{
    userName: 'user',
    profilePicture: "https://firebasestorage.googleapis.com/v0/b/twirrer-app.appspot.com/o/394413876440.jpeg?alt=media",
    postId: 'kdjsfgdksuufhgkdsufky',
    commentContent: 'nice one mate!',
    createdAt: '2019-03-15T10:59:52.798Z'
  }],
  notifications: [{
    recipient: 'user',
    sender: 'john',
    read: 'true | false',
    senderProfilePicture: "https://firebasestorage.googleapis.com/v0/b/twirrer-app.appspot.com/o/394413876440.jpeg?alt=media",
    postId: 'kdjsfgdksuufhgkdsufky',
    type: 'like | comment',
    createdAt: '2019-03-15T10:59:52.798Z'
  }],
  likes: [{
    postId: "kdjsfgdksuufhgkdsufky",
    profilePicture: "https://firebasestorage.googleapis.com/v0/b/twirrer-app.appspot.com/o/394413876440.jpeg?alt=media",
    userName: "user"
  }],
  friends: [{
    user: {
      profilePicture: "https://firebasestorage.googleapis.com/v0/b/twirrer-app.appspot.com/o/394413876440.jpeg?alt=media",
      userName: "user"
    },
    user2: {
      profilePicture: "https://firebasestorage.googleapis.com/v0/b/twirrer-app.appspot.com/o/394413876440.jpeg?alt=media",
      userName: "user2"
    }
  }]
};
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

// this data will retrieved for each user, will be globally
const userDetails = {
  // context api data
  credentials: {
    userId: 'dh23ggj5h32g543j5gf43',
    email: 'user@email.com',
    userName: 'user',
    createdAt: '2019-03-15T10:59:52.798Z',
    profilePicture: 'https://firebasestorage.googleapis.com/v0/b/twirrer-app.appspot.com/o/750854615984.png?alt=media',
    coverPicture: 'https://firebasestorage.googleapis.com/v0/b/twirrer-app.appspot.com/o/750854615984.png?alt=media',
    bio: 'Hello, my name is user, nice to meet you',
    website: 'https://user.com',
    location: 'Berlin, DE',
    friendsCount: 0
  },
  // retrieve likes that this user have made, to colored the heart of posts were liked by this user 
  likes: [{
      userName: 'user',
      postId: 'hh7O5oWfWucVzGbHH2pa'
    },
    {
      userName: 'user',
      postId: '3IOnFoQexRcofs5OhBXO'
    }
  ],

  // retrieve friends of this user
  friends: [{
    user: {
      profilePicture: "https://firebasestorage.googleapis.com/v0/b/twirrer-app.appspot.com/o/394413876440.jpeg?alt=media",
      userName: "user"
    },
    user2: {
      profilePicture: "https://firebasestorage.googleapis.com/v0/b/twirrer-app.appspot.com/o/394413876440.jpeg?alt=media",
      userName: "user2"
    }
  }]
};