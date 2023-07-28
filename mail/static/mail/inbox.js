document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
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

      emailElement.innerHTML =`<th scope="row">${rowCount}</th><td>${emailSender}</td><td>${emailSubject}</td><td>${emailTime}</td>`;
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
  document.querySelector('#email-view').innerHTML = `<table class="table" id="email-table"><thead class="thead-dark">
  <tr>
     <th scope="col">#</th>
     <th scope="col">From</th>
     <th scope="col">Recipients</th>
     <th scope="col">Subject</th>
     <th scope="col">Received</th>
   </tr>
 </thead>
 <tbody></tbody>`
   
  
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
    const mailElement = document.createElement('tr');

    // Name elements populate html
    mailElement.id = "email-row";
    mailElement.innerHTML =`<th scope="row"></th><td>${mailSender}</td><td>${mailRecipients}</td><td>${mailSubject}</td><td>${mailTime}</td>`;
    console.log(mailElement);
    document.querySelector('#email-table').append(mailElement);
    const mailBodyElement = document.createElement('div');
    mailBodyElement.id = "email-body-element";
    mailBodyElement.className ="card"
    mailBodyElement.innerHTML = `<div class="card-body">${mailBody}</div>`;
    document.querySelector('#email-view').append(mailBodyElement);
  });
}

