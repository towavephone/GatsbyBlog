var eleTds = document.querySelectorAll('tr td:first-child');
var arrColorLv2 = [
  'black',
  'silver',
  'gray',
  'white',
  'maroon',
  'red',
  'purple',
  'fuchsia',
  'green',
  'lime',
  'olive',
  'yellow',
  'navy',
  'blue',
  'teal',
  'aqua'
];

[].slice.call(eleTds).forEach(function(eleTd, index) {
  var color = eleTd.innerHTML;
  var level = '';
  if (/^[a-z]+$/.test(color)) {
    level = '3';
  }
  if (color == 'orange') {
    level = '2';
  } else if (color == 'rebeccapurple') {
    level = '4';
  } else if (arrColorLv2.indexOf(color) != '-1') {
    level = '1';
  }

  if (level) {
    eleTd.setAttribute('data-level', level);
    eleTd.setAttribute('data-index', index);
    eleTd.style.setProperty('--color', color);
  }
});

var eleTrs = [].slice.call(document.querySelectorAll('tr:not([class])'));
window.select.onchange = function() {
  var value = this.value;

  var num = 0;
  eleTrs.forEach(function(eleTr) {
    if (value == 'all') {
      eleTr.style.display = '';
      num++;
    } else {
      eleTr.style.display = 'none';
      if (eleTr.querySelector('td[data-level="' + value + '"]')) {
        eleTr.style.display = '';
        num++;
      }
    }
  });

  window.output.innerHTML = num;
};
