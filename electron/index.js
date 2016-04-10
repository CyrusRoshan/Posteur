angular.module('EmailApp', [])
  .controller('EmailCtrl', ['$scope', function($scope) {
    var emailCtrl = this;

    emailCtrl.selectedEmail = undefined;
    emailCtrl.isSelected = function(email) {
      if (email.email === emailCtrl.selectedEmail)
        return true;
      return false;
    }
    emailCtrl.selectEmail = function(email) {
      emailCtrl.selectedEmail = email.email;
    }

    emailCtrl.refresh = function() {
      console.log('Refreshing...');
    }

    emailCtrl.currentComposeState = '+';
    emailCtrl.currentComposeEmail = {};
    emailCtrl.compose = function() {
      if (emailCtrl.currentComposeState === '+') {
        emailCtrl.currentComposeState = 'X';
      } else {
        emailCtrl.currentComposeState = '+';
        emailCtrl.currentComposeEmail = {};
      }
    }

    emailCtrl.sendMail = function() {
      console.log(emailCtrl.currentComposeEmail);
      emailCtrl.compose();
      emailCtrl.emailSent = true;
      setTimeout(function() {
        emailCtrl.emailSent = false;
        $scope.$apply();
      }, 1500);
    }

    emailCtrl.emailSent = false;

    emailSearch = function(search) {
      var query = search.value.toLowerCase();
      if (query === '') {
        $scope.displayedEmails = emailCtrl.emails;
      } else {
        $scope.displayedEmails = emailCtrl.emails.filter(function(email){
          if (email.sender.toLowerCase().includes(query) || email.subject.toLowerCase().includes(query) || email.body.toLowerCase().includes(query)) {
            console.log('true');
            return true;
          }
          console.log('false');
          return false;
        })
        console.log($scope.displayedEmails);
      }
      emailCtrl.lolbugfix = "bugfix1";
      $scope.$apply();
      setTimeout(function() {
        emailCtrl.lolbugfix = "bugfix2";
        $scope.$apply();
      }, 10);
    }

    emailCtrl.emails = [
      {
        sender: 'Sender Name 1',
        subject: 'Subjecto yo',
        body: 'Example body text',
        attachments: undefined
      },
      {
        sender: 'Sender Name 1 pls',
        subject: 'Subjecto yo awif iwe feo iwe fewoi fwjf wi',
        body: 'Example body text',
        attachments: undefined
      },
      {
        sender: 'Sender Name 1',
        subject: 'pls',
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
    $scope.displayedEmails = emailCtrl.emails;


  }]);
