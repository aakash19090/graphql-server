import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition } from "semantic-ui-react";
import PostCard from '../components/PostCard'
import { AuthContext } from '../context/auth'
import PostForm from '../components/PostForm'
import { FETCH_POSTS_QUERY } from '../utils/graphql'

const Home = () => {

    const { user } = useContext(AuthContext);
    
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
                    user ? (
                        <Grid.Column className='col_space'>
                            <PostForm/>
                        </Grid.Column>
                    ):null
                }
                {
                    loading ? (
                        <h3>Loading...</h3>
                    ) : (
                        <Transition.Group duration={200}>
                            {
                                data.getPosts && data.getPosts.map( post => (
                                    <Grid.Column key={post.id} className='col_space'>
                                        <PostCard post={post} />
                                    </Grid.Column>
                                ) )
                            }
                        </Transition.Group>
                        
                    )
                }

            </Grid.Row>
            
        </Grid>
    );
}


export default Home;
