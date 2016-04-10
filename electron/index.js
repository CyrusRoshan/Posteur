angular.module('EmailApp', [])
  .controller('EmailCtrl', ['$scope', function($scope) {
    var emailCtrl = this;
    var selectedEmail = undefined;

    emailCtrl.isSelected = function(email) {
      if (email === selectedEmail)
        return true;
      return false;
    }

    emailCtrl.lolbugfix = "";

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

    emailCtrl.selectEmail = function(email) {
      selectedEmail = email;
    }

  }]);
