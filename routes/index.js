const articles = require('./articles')
const messages = require('./messages')
const admin = require('./admin')

module.exports = (app) => {
    app.use(articles)
    app.use(messages)
    app.use(admin)
}
