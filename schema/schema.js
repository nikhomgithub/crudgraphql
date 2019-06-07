const graphql = require('graphql');
const Book = require('../models/book');
const Author = require('../models/author');
const _ = require('lodash');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: ( ) => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            async resolve(parent, args){
                return await Author.findById(parent.authorId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: ( ) => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            async resolve(parent, args){
                return await Book.find({ authorId: parent.id });
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args){
                return await Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args){
                return await Author.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            async resolve(parent, args){
                return await Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            async resolve(parent, args){
                return await Author.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: GraphQLInt }
            },
            async resolve(parent, args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return await author.save();
            }
        },

        deleteAuthor: {
            type: AuthorType,
            args: { id: { type:new GraphQLNonNull(GraphQLID) } },
            async resolve(parent, args){
                return await 
                    Author.findByIdAndRemove({"_id":args.id})   
            }
        },

        updateAuthor: {
            type: AuthorType,
            args: { 
                id: { type:new GraphQLNonNull(GraphQLID) } ,
                name: { type: GraphQLString },
                age: { type: GraphQLInt },
            },
            async resolve(parent, args){
                return await 
                    Author.findByIdAndUpdate({"_id":args.id},args,{new:true})   
            }
        },


        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            async resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return await book.save();
            }
        },


        deleteBook: {
            type: BookType,
            args: { id: { type:new GraphQLNonNull(GraphQLID) } },
            async resolve(parent, args){
                return await 
                    Book.findByIdAndRemove({"_id":args.id})   
            }
        },

        updateBook: {
            type: BookType,
            args: { 
                id: { type:new GraphQLNonNull(GraphQLID) } ,
                name: { type: GraphQLString },
                genre: { type: GraphQLString },
                authorId:{type: GraphQLString}
            },
            async resolve(parent, args){
                return await 
                    Book.findByIdAndUpdate({"_id":args.id},args,{new:true})   
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});