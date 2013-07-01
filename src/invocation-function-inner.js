var programmer = {
  name: 'Jimmy',
  unlikes: 'emacs',
  complain: function() {
    var plethoraOfComplaints = function() {
      var
        complaint = '',
        i
      ;

      for (i = 0; i < 10; i++) {
        complaint += 'My name is ' + this.name + ' and I hate ' + this.unlikes + '.\n';
      }

      return complaint;
    };

    return plethoraOfComplaints();
  }
};

