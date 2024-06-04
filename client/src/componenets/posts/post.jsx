import React from "react";
import { Card } from "flowbite-react";

const Post = ({ question }) => {
return (
    <Card>
        <Card.Header>
            <Card.Title>{question.text}</Card.Title>
        </Card.Header>
        <Card.Body>
            <p>Topic: {question.topic}</p>
            <p>Uploader ID: {question.uploaderId}</p>
            <p>Timestamp: {question.timestamp}</p>
            <p>Upvotes: {question.upvotes}</p>
            <p>Downvotes: {question.downvotes}</p>
        </Card.Body>
    </Card>

};

export default Post;
