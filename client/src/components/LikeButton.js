import React, { useEffect, useState } from "react";
import { Button, Icon, Label } from "semantic-ui-react";
import { useMutation } from '@apollo/react-hooks'
import { Link } from "react-router-dom";
import gql from 'graphql-tag'


const LikeButton = ({ user, post: { id, likes, likeCount } }) => {

    const [ liked, setLiked ] = useState(false);

    useEffect(() => {
        // If User is logged in & the Post is already liked by user
        if(user && likes.find( like => like.username === user.username)) {
            setLiked(true);
        }else setLiked(false);
    }, [user, likes] )


    const [ likePost ] = useMutation(LIKE_POST, {
        variables:  {postId : id},
        // onError: () => {}
    })

    // Check if user is logged in
    const likeButton = user ? (
        liked ? (
            // Change Button if Post is already Liked
            <Button color="teal">
                <Icon name="heart" />
            </Button>
        ):(
            // If Post is not liked
            <Button color="teal" basic>
                <Icon name="heart" />
            </Button>
        )
    ) : (
        // If User is not logged in redirect to Login page on Clicking Like button
        <Button as={Link} to="/login" color="teal" basic>
            <Icon name="heart" />
        </Button>
    )

    return (
        <Button as="div" labelPosition="right" onClick={ user ? likePost : null}>
            {likeButton}
            <Label as="a" basic color="teal" pointing="left">
                {likeCount}
            </Label>
        </Button>
    )
}

const LIKE_POST = gql`
    mutation ( $postId : String! ) {
	likePost(postId: $postId) {
		id
		likes {
			username
			id
            createdAt
		}
		likeCount
	}
}

`

export default LikeButton
