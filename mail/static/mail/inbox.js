document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Event listener for form
  document.querySelector('#compose-form').addEventListener('submit', send_email);

  // Load inbox as default
  load_mailbox('inbox');
});

function compose_email() {

  //Console log
  console.log('compose');

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

   // Check if it's a reply
   if (localStorage.getItem('replyId')) {
    mailId = localStorage.getItem('replyId');
    console.log(mailId);
    
    // Get email via GET
    fetch(`/emails/${mailId}`)
    .then(response => response.json())
    .then(email => {
      console.log(email)
      const replyRecipients = email.sender;
      const replySubject = "Re:" + `${email.subject}`;
      const replyBody = `On ${email.timestamp}, 12:00 AM ${email.sender} wrote: ${email.body}`
      
      // Populate email
      document.querySelector('#compose-recipients').value = replyRecipients;
      document.querySelector('#compose-subject').value = replySubject;
      document.querySelector('#compose-body').value = replyBody;

      // Remove reply item
      localStorage.removeItem(['replyId']);
    })
  }
  }

function send_email(event) {  

  event.preventDefault();
  
  // Log
  console.log('send email')

  // Get values
  const mailRecipients = document.querySelector('#compose-recipients').value;
  const mailSubject = document.querySelector('#compose-subject').value;
  const mailBody = document.querySelector('#compose-body').value;
  console.log(`mail recipients: ${mailRecipients}`);

  // Get email content
  const recipients = mailRecipients;
  const subject = mailSubject;
  const body = mailBody;
  
  // Send mail
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json())
  .then(result => {
  
  // Print result
  console.log(result)
  console.log('message seems to be sent')

  // Load sent
  load_mailbox('sent');
  });
}  


function load_mailbox(mailbox) {
  
  // log mailbox name
  console.log(mailbox);
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  switch (mailbox) {

    // Inbox
    case 'inbox':
      mailbox == 'inbox';

    // Initialize rowCount
    var rowCount = 0;

    // Create emails table for inbox
    document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>
    <table class="table" id="emails-table">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">From</th>
        <th scope="col">Subject</th>
        <th scope="col">Received</th>
      </tr>
    </thead>
    <tbody>`;
    break;

    // Sent 
  case 'sent':
    mailbox == 'sent';

    console.log('loading Sent');

    // Initialize rowCount
    var rowCount = 0;

    // Create emails table for sent
    document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)} </h3>
    <table class="table" id="emails-table">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">To</th>
        <th scope="col">Subject</th>
        <th scope="col">Sent</th>
      </tr>
    </thead>
    <tbody>`
    break;

    // Archive
  case 'archive':
    mailbox == 'archive';

    // Initialize rowCount
    var rowCount = 0;

    // Create emails table for archive
    document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)} </h3>
    <table class="table" id="emails-table">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Sender</th>
        <th scope="col">Recipients</th>
        <th scope="col">Subject</th>
        <th scope="col">Timestamp</th>
      </tr>
    </thead>
    <tbody>`
    break;
  }

  // Get mail via GET
  console.log('getting emails');
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {

    // Print emails
    console.log(`fetch has been performed for ${mailbox}`);
    console.log(emails);

    // Loop through emails and populate mailbox HTML
    emails.forEach(element => {
      const emailSender = element.sender;
      const emailRecipients = element.recipients;
      const emailSubject = element.subject;
      const emailTime = element.timestamp;
      const emailId = element.id;
      const emailElement = document.createElement('tr');
      var emailRead = element.read;
      

      // Add id containing unique emailId
      emailElement.id = `email-row-${emailId}`;

      // If read make grey
      if (emailRead == true) {
        emailElement.className = "table-secondary"
      }

      switch (mailbox) {
        case 'inbox':

          // Inbox
          mailbox == 'inbox';

          // Add innerHTML for inbox 
          emailElement.innerHTML =`<th scope="row">${rowCount}</th><td>${emailSender}</td><td>${emailSubject}</td><td>${emailTime}</td><td></td>`;
          console.log(emailElement);
          document.querySelector('#emails-table').append(emailElement);
          rowCount ++;
          break;
        
        case 'sent':

          // Sent
          mailbox == 'sent';
          console.log('case sent');

          // Add innerHTML for sent
          emailElement.innerHTML =`<th scope="row">${rowCount}</th><td>${emailRecipients}</td><td>${emailSubject}</td><td>${emailTime}</td><td></td>`;
          console.log(emailElement);
          document.querySelector('#emails-table').append(emailElement);
          rowCount ++;
          break;

        case 'archive':

          // Archive
          mailbox == 'archive';
  
        // Add innerHTML for archive
          emailElement.innerHTML =`<th scope="row">${rowCount}</th><td>${emailSender}</td><td>${emailRecipients}<td>${emailSubject}</td><td>${emailTime}</td><td></td>`;
          console.log(emailElement);
          document.querySelector('#emails-table').append(emailElement);
          rowCount ++;
          break;
      }

      // Add event listener for click to read mail
      document.querySelector(`#email-row-${emailId}`).addEventListener('click', () => {
        read_email(`${emailId}`);
      })
    }) 
  
  }) 
  console.log(`reached end of ${mailbox}`);
} 

function read_email(mail) {

  // Log mail
  console.log(mail)

  // Mark as read
  fetch(`/emails/${mail}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })

  // Show email view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Create mail container
  document.querySelector('#email-view').innerHTML = '<div class="mail-container" id="mail-container"></div>'
   
  
  // get mail via GET
  fetch(`/emails/${mail}`)
  .then(response => response.json())
  .then(email => {
    // Print email
    console.log(email);
  
    // Email data variables
    const mailSender = email.sender;
    const mailRecipients = email.recipients;
    const mailSubject = email.subject;
    const mailTime = email.timestamp;
    const mailBody = email.body;
    const mailArchived = email.archived;
    const mailElement = document.createElement('tr');

    // Name elements populate html
    mailElement.id = "mail-header";

    // If not archived
    console.log(mailArchived);
    if (mailArchived == false) {
      mailElement.innerHTML = `<div><strong>From: &nbsp</strong>${mailSender}</div><div><strong>To:&nbsp</strong>${mailRecipients}</div><div><strong>Subject&nbsp</strong> ${mailSubject}</div><div><strong> Timestamp:&nbsp</strong>${mailTime}</div><button type="button" id="button-reply-${mail}" class="btn btn-outline-primary">Reply</button><button type="button" id="button-archive-${mail}" class="btn btn-outline-primary">Archive</button>`;
    } else {
      mailElement.innerHTML = `<div><strong>From: &nbsp</strong>${mailSender}</div><div><strong>To:&nbsp</strong>${mailRecipients}</div><div><strong>Subject&nbsp</strong> ${mailSubject}</div><div><strong> Timestamp:&nbsp</strong>${mailTime}</div><button type="button" id="button-reply-${mail}" class="btn btn-outline-primary">Reply</button><button type="button" id="button-unarchive-${mail}" class="btn btn-outline-primary">Unarchive</button>`;

    }

    console.log(mailElement);

    // Add new mail element to existing html
    document.querySelector('#mail-container').append(mailElement);

    // Create body HTML
    const mailBodyElement = document.createElement('div');
    mailBodyElement.id = "email-body-element";
    mailBodyElement.className ="card"
    mailBodyElement.innerHTML = `<p>${mailBody}</p>`
    
    // Add body element to HTML
    document.querySelector('#email-view').append(mailBodyElement);

    if (mailArchived == false) {
      // Add event listener for archive button
      document.querySelector(`#button-archive-${mail}`).addEventListener('click', () => {
        archive_email(`${mail}`);
      })} else {
      // Add event listener for unarchive button
      document.querySelector(`#button-unarchive-${mail}`).addEventListener('click', () => {
        unarchive_email(`${mail}`);
      })
      }

      // Add event listener for reply
      document.querySelector(`#button-reply-${mail}`).addEventListener('click', () => {
        const replyId = mail
        localStorage.setItem('replyId', replyId)
        compose_email();
      })

  });
}

function archive_email(mail) {
  // Log mail
  console.log(mail);
  console.log('archive');

  // Mark as archived
  fetch(`/emails/${mail}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: true
    })
  })
  load_mailbox('inbox');
}

function unarchive_email(mail) {
  // Log mail
  console.log(mail);
  console.log('unarchive')

  // Mark as archived
  fetch(`/emails/${mail}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: false
    })
  })
  load_mailbox('inbox');

}