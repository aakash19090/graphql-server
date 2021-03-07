import React, { useContext } from 'react'
import gql from 'graphql-tag'
import { Grid, Button, Card, Image, Icon, Label } from "semantic-ui-react";
import { useQuery } from '@apollo/react-hooks'
import moment from "moment";
import LikeButton from '../components/LikeButton'
import { AuthContext } from '../context/auth'

const  SinglePost = (props) => {

    const {user} = useContext(AuthContext);
    const postId = props.match.params.postId;

    const {data: { getPost } = {} } = useQuery(FETCH_SINGLE_POST, {
        variables: {
            postId
        }
    })

    let postMarkup;

    if(!getPost){
        postMarkup = <p>Loading Post...</p>
    }else{
        const {
            id,
            body,
            createdAt,
            username,
            comments,
            likes,
            likeCount,
            commentCount
        } = getPost;

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                        floated="right"
                        size="small"
                        src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                        />
                    </Grid.Column>


                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header> {username} </Card.Header>
                                <Card.Meta>
                                    {moment(createdAt).fromNow()}
                                </Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr/>

                            <Card.Content extra>
                                <LikeButton user={user} post={{ id, likeCount, likes }} />

                                <Button
                                    as="div"
                                    labelPosition="right"
                                    onClick={() => console.log('Comment on post')}
                                >
                                    <Button basic color="blue">
                                        <Icon name="comments" />
                                    </Button>
                                    <Label basic color="blue" pointing="left">
                                        {commentCount}
                                    </Label>
                                </Button>

                            </Card.Content>
                        </Card>
                    </Grid.Column>

                </Grid.Row>
            </Grid>
        )
    }

    return postMarkup
}

const FETCH_SINGLE_POST = gql`
    query ($postId: ID!) {
        getPost(postId: $postId) {
            id
            body
            createdAt
            username
            comments {
                id
                body
                createdAt
                username
            }
            likes {
                id
                username
                createdAt
            }
            likeCount
            commentCount
        }
    }

`

export default SinglePost
