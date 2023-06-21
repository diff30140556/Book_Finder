import { gql } from '@apollo/client';

export const CREATE_USER = gql`
    mutation createUser($username: String!, $email: String!, $password: String!) {
        createUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
                email
            }
        }
}`;

export const LOGIN = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
                email
                savedBooks {
                    bookId
                    title
                    authors
                    description
                    image
                    link
                }
            }
        }
}`;

export const SAVE_BOOK = gql`
    mutation Mutation($description: String!, $bookId: String!, $title: String!, $authors: [String], $image: String, $link: String) {
    saveBook(description: $description, bookId: $bookId, title: $title, authors: $authors, image: $image, link: $link) {
    _id
    username
    email
    savedBooks {
        bookId
        authors
        description
        image
        link
        title
        }
    }
}`;

export const DELETE_BOOK = gql`
    mutation deleteBook($user: ID!, $bookId: ID!) {
        deleteBook(user: $user, bookId: $bookId) {
            _id
            username
            email
            savedBooks {
                bookId
                title
                authors
                description
                image
                link
            }
        }
}`;