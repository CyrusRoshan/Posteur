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
        elem.subject = decodeURIComponent(elem.subject.replace(/\+/g, '%20'));
        elem.body = decodeURIComponent(elem.body.replace(/\+/g, '%20'));
        if (elem.subject.includes('1801'))
          elem.fraud = true;
        return elem;
      });
      console.log(dbInfo);
      emailCtrl.emails = dbInfo;
      emailSearch({value: ''});
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
      ipcRenderer.sendSync('CLI', `java -jar mailrunner.jar ${encodeURIComponent(emailCtrl.currentComposeEmail.recipients)} ${encodeURIComponent(emailCtrl.currentComposeEmail.subject)} ${encodeURIComponent(emailCtrl.currentComposeEmail.body)}`);

      emailCtrl.compose();
      emailCtrl.emailSent = true;
      setTimeout(function() {
        emailCtrl.emailSent = false;
        $scope.$apply();
      }, 1500);
    }

    emailCtrl.emailSent = false;

    emailSearch = function(search) {
      if (search.value === '') {
        $scope.displayedEmails = emailCtrl.emails;
      } else {
        var query = search.value.toLowerCase();
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

    emailCtrl.emails = [];
    $scope.displayedEmails = emailCtrl.emails;


  }]);
