import { gql } from 'apollo-boost';
//Get all authors
const getAuthors=gql`
    query{
        authors{
            name
            id
        }
    }
`;

//Get all books
const getBooks = gql`
    query{
        books {
            name
            id
            genre
            author{
                name
            }
        }
    }
`;

//add a book
const addBook=gql`
    mutation addBook($name:String!,$genre:String!,$authorId:ID!){
        addBook(name:$name,genre:$genre,authorId:$authorId){
            name
            id
        }
    }
`;

//get a book
const getBook=gql`
    query getBook($id:ID){
        book(id:$id){
            id
            name
            genre
            author{
                id
                name
                age
                books{
                    name
                    id
                }
            }
        }
    }
`;



export {getAuthors,getBooks,addBook,getBook};