var complaint = "Y u no giv me good specs";

var complain = function() {
  var myComplaint = this.complaint;
  var complainManyTimes = function() {
    var i = 0;
    for (i = 0; i < 10; i++) {
      myComplaint += "\n" + this.complaint;
    }
  };

  complainManyTimes();

  return myComplaint;
};
