require('dotenv').config()
let express = require('express')
let router = express.Router()
let github = require('octonode');
let client = github.client(process.env.GITHUB_TOKEN);
let githubverify = require('verify-github-webhook')
let app = require('../app')

router.get('/', (req, res) => {
  let repo = client.repo('1dv023/dl222is-examination-3')
    repo.issues((err, data) => {
    if (err) {
      console.error(err)
    } else {
    // console.log(data[0])
    res.render('issues/viewIssues', {issues: data})

    }
  })

  app.io.once('connection', (socket) => {
    console.log('Client connected!')
  
    socket.on('disconnect', function(){
      console.log('User disconnected');
    });
  })
})

router.post('/webhook', (req, res) => {
  let data = {headers: req.headers, body: req.body}
  if (verifyGithubWebhook(req.headers.get('X-Hub-Signature'), req.body, process.env.GITHUB_SECRET)) {
    app.io.emit('incoming', data)
  }
})

module.exports = router
