import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid } from "semantic-ui-react";
import gql from "graphql-tag";
import PostCard from '../components/PostCard'

function Home() {

    const { loading, data } = useQuery(FETCH_POSTS_QUERY);

    return (
        <Grid columns={3}>

            <Grid.Row>
                <Grid.Column>
                    <h1>Recent Posts</h1>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>  

                {
                    loading ? (
                        <h3>Loading...</h3>
                    ) : (
                        
                        data.getPosts && data.getPosts.map( post => (
                            <Grid.Column key={post.id}>
                                <PostCard post={post} />
                            </Grid.Column>
                        ) )
                    )
                }

            </Grid.Row>
            
        </Grid>
    );
}

const FETCH_POSTS_QUERY = gql`
    {
        getPosts {
            id
            body
            createdAt
            username
            comments {
                id
                body
                username
                createdAt
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
`;

export default Home;
