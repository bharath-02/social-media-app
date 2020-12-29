import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function PostForm() {

    const { values, handleChange, handleSubmit } = useForm(createPostCallback, {
        body: ''
    });

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY, data: {
                    getPosts: [result.data.createPost, ...data.getPosts]
                }
            })
            values.body = '';
        },
        onError(error) {
            console.log(error);    
        }
    });



    function createPostCallback() {
        createPost()
    }
    
    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <h2>Create a post:</h2>
                <Form.Field>
                    <Form.Input
                        placeholder="Hiii World!!"
                        name="body"
                        onChange={handleChange}
                        value={values.body}
                        error={error ? true : false}
                    />
                    <Button type="submit" color="teal">Post</Button>
                </Form.Field>
            </Form>
            {error && (
                <div className="ui error message" style={{fontSize: 20}}>
                    <ul className="list">
                        <li>{error.graphQLErrors[0].message}</li>
                    </ul>
                </div>
            )}
        </div>
    )
}

const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!) {
        createPost(body: $body) {
        id
        body
        createdAt
        username
        likes {
            id
            username
            createdAt
        }
        likeCount
        comments {
            id
            body
            username
            createdAt
        }
        commentCount
        }
    }
`;


export default PostForm;
