module.exports = app => {

  app.log('Yay, the app was loaded!')

  //app.on('issues.opened', async context => {
  //  app.log('Received issues.opened event')
  //  const issueComment = context.issue({ body: 'Thanks for opening this issue!' })
  //  return context.github.issues.createComment(issueComment)
  //})

  app.on('label.created', async context => {
    app.log('Received label.created event')
    const owner = await context.payload.repository.owner.login
    const repo = await context.payload.repository.name
    const label = await context.payload.label.name
    const issue = context.issue({ owner: owner, repo: repo, title: 'Label Created', body: 'A label was created' })
    return context.github.issues.create(issue)
  })
}
