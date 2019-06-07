import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo';
import { getAuthors, addBook, getBooks } from '../queries/queries';

class AddBook extends Component {
  state={
    name:'',
    genre:'',
    authorId:''
  };

  displayAuthors=()=>{
    var getAuthors=this.props.getAuthors;
    if(getAuthors.loading){
      return(<option disabled>Loading authors</option>)
    }
    else{      
      return getAuthors.authors.map(author=>
        (<option key={author.id} value={author.id}>{author.name}</option>)
        //{return(<option key={author.id} value={author.id}>{author.name}</option>);}
      )
    }
  }

  submitForm=(e)=>{
    e.preventDefault()
    // use the addBookMutation
    this.props.addBook({
        variables: {
            name: this.state.name,
            genre: this.state.genre,
            authorId: this.state.authorId
        },
        refetchQueries: [{ query: getBooks }]
    });
  }
  render() {
    return (
      <form id="add-book" onSubmit={this.submitForm}>
                <div className="field">
                    <label>Book Name:</label>
                    <input type="text" onChange={ (e) => this.setState({ name: e.target.value }) } />
                </div>
                <div className="field">
                    <label>Genre:</label>
                    <input type="text" onChange={ (e) => this.setState({ genre: e.target.value }) } />
                </div>
                <div className="field">
                    <label>Author:</label>
                    <select onChange={ (e) => this.setState({ authorId: e.target.value }) } >
                        <option>Select author</option>
                        { this.displayAuthors() }
                    </select>
                </div>
                <button>+</button>
            </form>
    )
  }
}

export default compose(
  graphql(getAuthors,{name:"getAuthors"}),
  graphql(addBook,{name:"addBook"})
)(AddBook);