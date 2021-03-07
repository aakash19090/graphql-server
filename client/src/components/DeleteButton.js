import React, { useState } from 'react'
import { Button,Icon, Confirm } from "semantic-ui-react";
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { FETCH_POSTS_QUERY } from '../utils/graphql'


const DeleteButton = ({postId}) => {

    const [ confirmOpen, setConfirmOpen ] = useState(false)
    
    const [ deletePost ] = useMutation(DELETE_POST,{
        update: (proxy, result) => {
            setConfirmOpen(false)
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                  getPosts: data.getPosts.filter(p => p.id !== postId)
                }
            });
            
        },
        onError: ()=> {},
        variables: {
            postId
        }
    })

    return (
        <>
            <Button as="div" icon floated="right" color="red" onClick={() => setConfirmOpen(true)}>
                <Icon name='trash' />
            </Button>
            <Confirm open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={deletePost} />
        </>
    )
}

const DELETE_POST = gql`
    mutation ($postId: ID!) {
        deletePost(postId: $postId)
    }
`

export default DeleteButton
