module.exports = app => {

  // Debug message
  app.log('Yay, the app was loaded!')

  // Listen to Label events
  app.on(['label.created', 'label.edited', 'label.deleted'], async context => {
    app.log('Received a label event')

    // Get payload data
    const actor = await context.payload.sender.login
    const repo_owner = await context.payload.repository.owner.login
    const repo_name = await context.payload.repository.name
    const label_name = await context.payload.label.name
    const label_action = await context.payload.action
    const label_url = await context.payload.repository.html_url + '/labels'
    const label_color = await context.payload.label.color

    // Generate new Issue object
    const issue = context.issue({ owner: repo_owner, 
                                  repo: repo_name, 
                                  title: 'Label ' + label_action + ' - ' + label_name, 
                                  body: 'A label was ' + label_action + ' by @'+actor+':\n\n<kbd>'+label_name+'</kbd> `#'+label_color+'`\n\nSee the list of labels at ' + label_url
                                })
    
    // Let's display the old name if a label was edited
    if (context.payload.action == 'edited') {
      const label_old_name = await context.payload.changes.name.from
      issue.body = issue.body + '\n\nOld name: ' + label_old_name
    }

    // Create the new Issue
    return context.github.issues.create(issue)
  })
}
