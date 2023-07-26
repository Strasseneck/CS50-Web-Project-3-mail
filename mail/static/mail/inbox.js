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
     console.log(result);
    });
    
  }
}

function load_mailbox(mailbox) {
  
  // log mailbox name
  console.log(mailbox)
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)} </h3> <div class="heading-container" >  <h4> From </h4> <h4> Subject </h4> <h4> Received </h4> </div> <div class="flex-container" id="emails-container"> </div>`;


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
      const emailElement = document.createElement('div');
      emailElement.id = "email-container"
      emailElement.innerHTML = `<div class="email-header" id="email-sender"> ${emailSender} </div> <div class="email-header" id="email-subject"> ${emailSubject} </div> <div class="email-header" id="email-time"> ${emailTime} </div>`;
      console.log(emailElement)
      document.querySelector('#emails-container').append(emailElement)
    });
  });

}

