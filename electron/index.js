const ipcRenderer = require('electron').ipcRenderer;

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
      ipcRenderer.sendSync('CLI', './db_service/db_service.native -force-retrieval-job');
      var dbInfo = JSON.parse(ipcRenderer.sendSync('CLI', './db_service/db_service.native -show-emails')).emails.map(function (elem) {
        elem.subject = decodeURIComponent(elem.subject.replace('+', ' '));
        elem.body = decodeURIComponent(elem.body.replace('+', ' '));
        return elem;
      });
      console.log(dbInfo);
      emailCtrl.emails = dbInfo;
      $scope.$apply();
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
      ipcRenderer.sendSync('CLI', `${encodeURIComponent(emailCtrl.currentComposeEmail.recipients)} ${encodeURIComponent(emailCtrl.currentComposeEmail.subject)} ${encodeURIComponent(emailCtrl.currentComposeEmail.body)}`);

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
          if (email.from.toLowerCase().includes(query) || email.subject.toLowerCase().includes(query) || email.body.toLowerCase().includes(query)) {
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
        from: 'Sender Name 1',
        subject: 'Subjecto yo',
        body: 'Example body text',
        attachments: undefined
      },
      {
        from: 'Sender Name 1 pls',
        subject: 'Subjecto yo awif iwe feo iwe fewoi fwjf wi',
        body: 'Example body text',
        attachments: undefined
      },
      {
        from: 'Sender Name 1',
        subject: 'pls',
        body: 'Example body text',
        attachments: undefined
      }
    ];
    $scope.displayedEmails = emailCtrl.emails;


  }]);
