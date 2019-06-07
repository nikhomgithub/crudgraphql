const express = require('express');
const mongoose = require('mongoose');

const path = require('path');
const config = require('config');
const cors = require('cors');

const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

// allow cross-origin requests
app.use(cors());

// Bodyparser Middleware
app.use(express.json());

// DB Config
const db = config.get('mongoURI');


// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

// Connect to Mongo
mongoose
  .connect(db, { 
    useNewUrlParser: true,
    useCreateIndex: true
  }) // Adding new mongo url parser
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));


// bind express with graphql
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`a Server started on port ${port}`));