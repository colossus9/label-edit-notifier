module.exports = app => {

  app.log('Yay, the app was loaded!')

  //app.on('issues.opened', async context => {
  //  app.log('Received issues.opened event')
  //  const issueComment = context.issue({ body: 'Thanks for opening this issue!' })
  //  return context.github.issues.createComment(issueComment)
  //})

  app.on('label.created', async context => {
    app.log('Received label event')

    // Get payload data
    const owner = await context.payload.repository.owner.login
    const repo_name = await context.payload.repository.name
    const label_name = await context.payload.label.name
    const label_action = await context.payload.action
    const label_url = await context.payload.repository.html_url + '/labels'
    const label_color = await context.payload.label.color

    // Generate new Issue object
    const issue = context.issue({ owner: owner, 
                                  repo: repo_name, 
                                  title: 'Label ' + label_action + ' - ' + label_name, 
                                  body: 'A label was ' + label_action + ':\n\n<kbd>'+label_name+'</kbd> `#'+label_color+'`\n\nSee the label at ' + label_url
                                })
    
    // Create the new Issue
    return context.github.issues.create(issue)
  })
}
