$('select').selectMatch();

var eleBorder = document.getElementById('border');
document.getElementsByTagName('select')[0].onchange = function() {
  eleBorder.style.borderStyle = this.value;
};
