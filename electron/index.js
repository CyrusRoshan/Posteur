angular.module('EmailApp', [])
  .controller('EmailCtrl', function() {
    var emailCtrl = this;
    var selectedEmail = undefined;
    
    emailCtrl.isSelected = function(email) {
      if (email === selectedEmail)
        return true;
      return false;
    }

    emailCtrl.emails = [
      {
        sender: 'Sender Name 1',
        subject: 'Subjecto yo',
        body: 'Example body text',
        attachments: undefined
      },
      {
        sender: 'Sender Name 1',
        subject: 'Subjecto yo awif iwe feo iwe fewoi fwjf wi',
        body: 'Example body text',
        attachments: undefined
      },
      {
        sender: 'Sender Name 1',
        subject: 'Subjecto yo',
        body: 'Example body text',
        attachments: undefined
      }
    ];

    for (var i = 0; i < 20; i++) {
      emailCtrl.emails.push(       {
              sender: 'Sender Name 1',
              subject: 'Subjecto yo',
              body: 'Example body text',
              attachments: undefined
            })
    }

  emailCtrl.selectEmail = function(email) {
    selectedEmail = email;
  }

  });
