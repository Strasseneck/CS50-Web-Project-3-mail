document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Check local story for justSent item
  if (!localStorage.getItem('justSent')) {

    // If not set it to false
    localStorage.setItem('justSent', false);

  } else {
    
    console.log(justSent);
    // Create justSent variable and check it
    var justSent = localStorage.getItem('justSent');
    if (justSent == true) {
      
      // if true set to false load sent
      justSent = false;
      load_mailbox('sent');
    } else {

      // load inbox as default when false
      load_mailbox('inbox');
    
    }
  }
});

function compose_email() {

  // Declare variables for use later
  const mailRecipients = document.querySelector('#compose-recipients');
  const mailSubject = document.querySelector('#compose-subject');
  const mailBody = document.querySelector('#compose-body');

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // Listen for submission of form
  document.querySelector('#compose-form').onsubmit = () => {
    
    // Get email content
    const recipients = mailRecipients.value;
    const subject = mailSubject.value;
    const body = mailBody.value;
    
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
    justSent = true;
    });
  }
  
}

function load_mailbox(mailbox) {
  
  // log mailbox name
  console.log(mailbox);
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  if (mailbox == 'inbox') {
    var rowCount = 0;

  // Create emails table for inbox
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)} </h3>
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
  } else {

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
  <tbody>`;
  }

  // Get mail via GET
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {

    // Print emails
    console.log(emails);

    // Loop through emails and populate mailbox HTML
    emails.forEach(element => {
      const emailSender = element.sender;
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

      // Add innerHTML
      emailElement.innerHTML =`<th scope="row">${rowCount}</th><td>${emailSender}</td><td>${emailSubject}</td><td>${emailTime}</td><td></td>`;
      console.log(emailElement);
      document.querySelector('#emails-table').append(emailElement);
      rowCount ++;

      // Add event listener for click to read mail
      document.querySelector(`#email-row-${emailId}`).addEventListener('click', () => {
        read_email(`${emailId}`);
      })

    })
     
  }) 
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
    const mailSender = email.subject;
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