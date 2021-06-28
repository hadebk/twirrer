import React, { useState, useContext, useEffect, Fragment } from "react";

// style
import "./PostDetails.scss";

// assets
import Empty from "../../assets/Images/empty.svg";

// api service
import PostService from "../../services/PostService";

// component
import CommentCard from "../../components/CommentCard/CommentCard";
import AddComment from "../../components/AddComment/AddComment";
import PostCardDetails from "../../components/PostCardDetails/PostCardDetails";
import Spinner from "../../components/Spinner/Spinner";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";

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
  // ******* end global state *******//

  //local state
  const [postId, setPostId] = useState(
    props.match.params.postId ? props.match.params.postId : ""
  );
  const [postData, setPostData] = useState([]);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  // set page title
  document.title = language.postDetails.pageTitle;

  useEffect(() => {
    setPostId(props.match.params.postId);
    let postID = props.match.params.postId;

    // get cache (current post), each post will be cached with key (postID)
    let cachedCurrentPost = JSON.parse(window.sessionStorage.getItem(postID));

    if (cachedCurrentPost) {
      // current post's data are cached
      setPostData(cachedCurrentPost.postContent);
      setComments(cachedCurrentPost.postComments);
      setLikes(cachedCurrentPost.postLikes);
      setLoading(false);
    } else {
      // get current post from DB
      setLoading(true);
      if (postID) {
        // get all details of current post
        PostService.getPostDetails(postID)
          .then((res) => {
            let postContent = res.data.post;
            postContent.postId = res.data.postId;
            setPostData(postContent);
            setComments(res.data.comments);
            setLikes(res.data.likes);
            // add current post's data to session storage (cache)
            window.sessionStorage.setItem(
              postID,
              JSON.stringify({
                postContent,
                postComments: res.data.comments,
                postLikes: res.data.likes,
              })
            );
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      }
    }
  }, [props.match.params.postId]);

  const goToBack = () => {
    props.history.goBack();
  };

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
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          {/* post data */}
          <div className='postDetails'>
            <PostCardDetails
              postData={postData}
              setPostData={setPostData}
              likes={likes}
              setLikes={setLikes}
            />
          </div>

          {/* add comment input */}
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

          {/* comments */}
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
        </Fragment>
      )}
    </div>
  );
};

export default PostDetails;
