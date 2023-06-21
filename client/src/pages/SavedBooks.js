import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { DELETE_BOOK } from '../utils/mutations';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

// import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});

  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;
  const { loading, data } = useQuery(QUERY_ME);
  const [deleteBook, { error }] = useMutation(DELETE_BOOK);

  if (loading) {
    return <div>Loading...</div>
  }
  const savedBooks = data?.me?.savedBooks || [];

  // create function that accepts the book's mongo _id value as param and deletes the book from the database

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }
    const user = Auth.getProfile();

    
    try {
      const response = await deleteBook({
        variables: {
          user: user.data._id,
          bookId: bookId
        } 
      });

      const updatedUser = await response.data.deleteBook;
      setUserData(updatedUser);
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  // if (!userDataLength) {
  //   return <h2>LOADING...</h2>;
  // }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {data.me.savedBooks.length
            ? `Viewing ${data.me.savedBooks.length} saved ${data.me.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {data.me.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
