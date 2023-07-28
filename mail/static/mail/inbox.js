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

  // Show the mailbox name and headers for Inbox
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)} </h3> <div class="heading-container" >  <h4> From </h4> <h4> Subject </h4> <h4> Received </h4> </div> <div class="flex-container" id="emails-container"> </div>`;
  } else {

  // Show the mailbox name and headers for Sent
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)} </h3> <div class="heading-container" >  <h4> To </h4> <h4> Subject </h4> <h4> Sent </h4> </div> <div class="flex-container" id="emails-container"> </div>`;
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
      const emailElement = document.createElement('div');
      emailElement.id = `email-container-${emailId}`;
      emailElement.innerHTML = `<div class="email-header" id="email-header">${emailSender} ${emailSubject} ${emailTime}</div>`;
      console.log(emailElement);
      document.querySelector('#emails-container').append(emailElement);
      document.querySelector(`#email-container-${emailId}`).addEventListener('click', () => {
        read_email(`${emailId}`);
      })
      })
  }) 
} 

function read_email(mail) {

  // Log mail
  console.log(mail)

  // Show email view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Create mail container
  document.querySelector('#email-view').innerHTML = '<div class="mail-container" id="mail-container"></div>';
  
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
    const mailElement = document.createElement('div');
    mailElement.id = "mail-element";
    mailElement.innerHTML = `<div class="mail-header"> <strong> From:  </strong>${mailSender}<strong> Recipients:  </strong>${mailRecipients}<strong> Subject:  </strong>${mailSubject}<strong> Time:  </strong>${mailTime}</div><div class="mail-body" id="mail-body"> ${mailBody}</div>`;
    console.log(mailElement);
    document.querySelector('#mail-container').append(mailElement);
  });
}

