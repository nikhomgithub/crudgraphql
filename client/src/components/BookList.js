import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { getBooks } from '../queries/queries';
import BookDetail from './BookDetail';
import { get } from 'https';

class BookList extends Component {
    state = {
            id:null,
            name:null,
            genre:null,
            author:null,
    }
    
    displayBooks=()=>{
        var getBooks = this.props.getBooks;
        if(getBooks.loading){
            return(<div>Loading Books</div>)
        }
        else{
            return getBooks.books.map(book=>{
                return<li   key={book.id} 
                            onClick={e=>
                                { this.setState({
                                    id:book.id,
                                    name:book.name,
                                    genre:book.genre,
                                    author:book.author
                                                })
                                  console.log(book.author)                
                                }
                    }>
                    {book.name}
                </li>    
                }
            )
        }
    }

    render(){
        return(
            <div>
                   
                <h3>{`Book Title: ${this.state.name}`}</h3>
                
                {!this.state.author?<h3>Author: No Info</h3>:<h3 style={{color:'red'}}>{`Author :${this.state.author.name}`}</h3>}

                <ul id="book-list">
                    { this.displayBooks() }
                </ul>
                <BookDetail/>
            </div>
        );
    }
}

export default compose( 
    graphql(getBooks,{name:"getBooks"})
)(BookList);