const express = require('express')

const api = require('./api')
const sequelize = require('./lib/sequelize')
const { connectToDb } = require('./lib/mongo')
const { connectToRabbitMQ, getChannel } = require('./lib/rabbitmq')

const app = express()
const port = process.env.PORT || 8000
const queue = 'rosters'

app.use(express.json())
app.use(express.static('public'))

/*
 * All routes for the API are written in modules in the api/ directory.  The
 * top-level router lives in api/index.js.  That's what we include here, and
 * it provides all of the routes.
 */
app.use('/', api)

app.use('*', (err, req, res, next) => {
  console.error(err);
  res.status(500).send({
	  err: "An error occurred.  Try again later."
  });
});

app.use('*', function (req, res, next) {
  res.status(404).json({
    error: "Requested resource " + req.originalUrl + " does not exist"
  })
})

sequelize.sync().then(function() {
  connectToDb(async () => {
    await connectToRabbitMQ(queue)
    app.listen(port, function () {
      console.log("== Server is running on port", port)
    })
  })
})