let db = {
    users: [
      {
        userId: 'dh23ggj5h32g543j5gf43',
        email: 'user@email.com',
        handle: 'user',
        createdAt: '2019-03-15T10:59:52.798Z',
        profilePicture: 'https://firebasestorage.googleapis.com/v0/b/twirrer-app.appspot.com/o/750854615984.png?alt=media',
        coverPicture: 'https://firebasestorage.googleapis.com/v0/b/twirrer-app.appspot.com/o/750854615984.png?alt=media',
        bio: 'Hello, my name is user, nice to meet you',
        website: 'https://user.com',
        location: 'Berlin, DE'
      }
    ],
    screams: [
      {
        userId: "user",
        /*postId: "H2oIs5GtVPVbqYI1YTQC",*/
        postContent: "Hi friends!",
        postImage: "https://firebasestorage.googleapis.com/v0/b/twirrer-app.appspot.com/o/750854615984.png?alt=media",
        createdAt: "2020-06-16T20:46:50.192Z",
        likeCount: 5,
        commentCount: 3
    }
    ],
    comments: [
      {
        userHandle: 'user',
        screamId: 'kdjsfgdksuufhgkdsufky',
        body: 'nice one mate!',
        createdAt: '2019-03-15T10:59:52.798Z'
      }
    ],
    notifications: [
      {
        recipient: 'user',
        sender: 'john',
        read: 'true | false',
        screamId: 'kdjsfgdksuufhgkdsufky',
        type: 'like | comment',
        createdAt: '2019-03-15T10:59:52.798Z'
      }
    ]
  };
  // this data will retrieved for each user, will be globally
  const userDetails = {
    // context api data
    credentials: {
      userId: 'dh23ggj5h32g543j5gf43',
      email: 'user@email.com',
      handle: 'user',
      createdAt: '2019-03-15T10:59:52.798Z',
      profilePicture: 'https://firebasestorage.googleapis.com/v0/b/twirrer-app.appspot.com/o/750854615984.png?alt=media',
      coverPicture: 'https://firebasestorage.googleapis.com/v0/b/twirrer-app.appspot.com/o/750854615984.png?alt=media',
      bio: 'Hello, my name is user, nice to meet you',
      website: 'https://user.com',
      location: 'Berlin, DE'
    },
    // retrieve likes that this user have made, to colored the heart of posts were liked by this user 
    likes: [
      {
        userHandle: 'user',
        screamId: 'hh7O5oWfWucVzGbHH2pa'
      },
      {
        userHandle: 'user',
        screamId: '3IOnFoQexRcofs5OhBXO'
      }
    ]
  };