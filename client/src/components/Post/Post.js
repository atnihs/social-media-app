import React from "react";
import "./Post.css";
import { gql, useMutation } from "@apollo/client";

const PUBLISH_POST = gql`
  mutation PublishPost($postId: ID!) {
    postPublish(postId: $postId) {
      userErrors {
        message
      }
      post {
        title
      }
    }
  }
`;

const UNPUBLISH_POST = gql`
  mutation UnPublishPost($postId: ID!) {
    postUnPublish(postId: $postId) {
      userErrors {
        message
      }
      post {
        title
      }
    }
  }
`;

export default function Post({
  title,
  content,
  date,
  user,
  published,
  id,
  isMyProfile
}) {
  const [ publishPost, { data: publishData, loading: publishLoading }]= useMutation(PUBLISH_POST);
  const [ unPublishPost, { data: unpublishData, loading: unpublishLoading }]= useMutation(UNPUBLISH_POST);
  const formatedDate = new Date(Number(date));
  return (
    <div className="Post" style={published === false ? { backgroundColor: "hotpink"} : {}}>
      {isMyProfile && published === false && <p className="Post__publish" onClick={() => { 
        publishPost({
          variables: {
            postId: id
          }
        })}}>Publish</p>}
      {isMyProfile && published === true && <p className="Post__publish" onClick={() => { 
        unPublishPost({
          variables: {
            postId: id
          }
        })}}>Unpublish</p>}
      <div className="Post__header-container">
        <h2>{title}</h2>
        <h4>
          Created At {`${formatedDate}`.split(" ").splice(0, 3).join(" ")} by {user}
        </h4>
      </div>
      <p>{content}</p>
    </div>
  );
}
