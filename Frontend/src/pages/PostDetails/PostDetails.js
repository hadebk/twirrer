import React, { useState, useContext, useEffect } from "react";

// style
import "./PostDetails.scss";

// assets
import Empty from "../../assets/Images/empty.svg";

// libraries
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// api service
import PostService from "../../services/PostService";

// component
import CommentCard from "../../components/CommentCard/CommentCard";
import AddComment from "../../components/AddComment/AddComment";
import PostCardDetails from "../../components/PostCardDetails/PostCardDetails";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";
import PostsContext from "../../context/PostsContext";

const PostDetails = (props) => {
  // ******* start global state *******//
  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  // user context
  const { userData } = useContext(UserContext);

  // posts context
  const { posts } = useContext(PostsContext);
  // ******* end global state *******//

  //local state
  const [postId, setPostId] = useState(props.match.params.postId);
  const [postData, setPostData] = useState([]);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  document.title = language.postDetails.pageTitle;

  useEffect(() => {
    setLoading(true);
    if (postId) {
      // get all details of current post
      PostService.getPostDetails(postId)
        .then((res) => {
          console.log("postDetails----");
          let result = res.data.post;
          result.postId = res.data.postId;
          setPostData(result);
          setComments(res.data.comments);
          setLikes(res.data.likes);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [postId]);

  /*
  useEffect(() => {
    console.log('PostDetails comments----');
  }, [posts, userData.user, comments, setComments, postData])
    */

  const goToBack = () => {
    props.history.goBack();
  };

  // init
  dayjs.extend(relativeTime);

  return (
    <div
      className='postDetails__main'
      style={{
        background: `${theme.background}`,
      }}
    >
      <div
        className='postDetails__main__title'
        style={{
          borderBottom: `1px solid ${theme.border}`,
          background: `${theme.background}`,
        }}
      >
        <div
          className='postDetails__main__title__iconBox'
          onClick={() => goToBack()}
        >
          <i
            className='far fa-arrow-left'
            style={{ color: theme.mainColor }}
          ></i>
          <div
            className='postDetails__main__title__iconBox__background'
            style={{
              background: theme.secondaryColor,
            }}
          ></div>
        </div>
        <h1
          style={{
            color: `${theme.typoMain}`,
          }}
        >
          {language.postDetails.title}
        </h1>
      </div>
      <div className='postDetails'>
        {/*{loading ? (
          <div className='spinner'>
            <Spinner />
          </div>
        ) : (*/}
        <PostCardDetails
          postData={postData}
          setPostData={setPostData}
          likes={likes}
          setLikes={setLikes}
        />
        {/* )}*/}
      </div>
      {userData.isAuth ? (
        <AddComment
          postId={postId}
          comments={comments}
          setComments={setComments}
          postData={postData}
          setPostData={setPostData}
        />
      ) : (
        ""
      )}
      <div className='postComments'>
        {comments.length > 0 ? (
          [...comments].map((comment) => (
            <CommentCard
              comment={comment}
              authorName={postData.userName}
              key={comment.createdAt}
            />
          ))
        ) : (
          <div className='postComments__empty'>
            <img src={Empty} alt='empty' />
            <p
              style={{
                color: `${theme.typoSecondary}`,
              }}
            >
              {language.postDetails.noCommentHint}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
