$(function() {

  let elems = [];
  let semesters = [];
  let subjects = [];
  let target = [];
  let grades = [0, 0, 0, 0, 0];
  let grade_persent = [0, 0, 0, 0, 0];
  let credit_sum = 0;
  let score_sum = 0;
  let gpa = 0;
  
  function z2h(str) {
      return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
          return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
      });
  }

  $('#load').on('click', function() {
    elems = [];
    semesters = [];
    subjects = [];
    $('#calc').prop('disabled' ,true);
    $('#choise').empty();
    $('#chartBox').empty();
    $('#gpascore').empty();
    let input = $('#textinput').val();
    let lines = input.split('\n');

    for (let i = 0; i < lines.length; i++) {
      let elem = lines[i].split('\t').map(function(item){ return item.replace(/\s/g, ''); });
      elems.push(elem);
    }

    for (let j = 0; j < elems.length; j++) {
      if (elems[j].length == 8 && elems[j][1] != ('担当教員')) {
        let year = elems[j][6];
        let term = elems[j][7];
        let semester = year + ' ' + term;

        subjects.push(elems[j]);
        if (!semesters.includes(semester)) {
          semesters.push(semester);
        }
      }
    }

    semesters.sort();

    if (semesters.length != 0) {
      $('#choise').append('<div class="alert alert-info" role="alert">計算に含めるセメスターを選択してください</div>');
      for (let k = 0; k < semesters.length; k++) {
        let name = semesters[k];
        $('<input />', { type: 'checkbox', 'class': 'btn-check', id: name, name: 'sem', autocomplete: 'off', 'checked': true }).appendTo($('#choise'));
        $('<label />', { 'class': 'btn btn-outline-secondary btn-lg', 'for': name, text: name }).appendTo($('#choise'));
      }

      $('#calc').prop('disabled' ,false);
    } else {
      alert('成績を読み取ることができませんでした (´・ω・｀)');
    }
  });

  $('#calc').on('click', function() {
    target = [];
    credit_sum = 0;
    score_sum = 0;
    grades = [0, 0, 0, 0, 0];
    grade_persent = [0, 0, 0, 0, 0];
    $('#gpascore').empty();
    $('#chartBox').empty();

    $('input[name="sem"]:checked').each(function() {
      target.push($(this).attr('id'));
    })

    if (target.length != 0) {
      for (let i = 0; i < subjects.length; i++) {
        let year = subjects[i][6];
        let term = subjects[i][7];
        let semester = year + ' ' + term;

        if (target.includes(semester)) {
          let credit_rate = parseInt(subjects[i][3]);
          let credit_score = z2h(subjects[i][5]);
          if (!isNaN(credit_rate)) {
          credit_sum += credit_rate;

          switch (credit_score) {
            case 'AA':
              score_sum += 4 * credit_rate;
              grades[0] += credit_rate;
              break;
            case 'A':
              score_sum += 3 * credit_rate;
              grades[1] += credit_rate;
              break;
            case 'B':
              score_sum += 2 * credit_rate;
              grades[2] += credit_rate;
              break;
            case 'C':
              score_sum += 1 * credit_rate;
              grades[3] += credit_rate;
              break;
            case 'D':
              grades[4] += credit_rate;
          }
          }
        }
      }

      for (let j = 0; j < grades.length; j++) {
        grade_persent[j] = grades[j] / credit_sum * 100;
      }

      gpa = Math.floor( score_sum * 100 / credit_sum) / 100 ;

      $('#gpascore').append('<h1 class="display-1">GPA: ' + gpa + '</h1>');
      $('#chartBox').append('<canvas id="chart" height="200" width="400"></canvas>');
      
      let chartData = {
        labels: [
          'AA',
          'A',
          'B',
          'C',
          'D'
        ],
        datasets: [{
          label: '取得単位数',
          data: grades,
          backgroundColor: [
            'rgb(42,131,180, 0.75)',
            'rgb(96,186,160, 0.75)',
            'rgb(162,213,159, 0.75)',
            'rgb(220,236,150, 0.75)',
            'rgb(244,167,97, 0.75)'
          ],
          hoverOffset: 4
        }]
      }

      jQuery (function ()
      {
        let config = {
          type: 'bar',
          data: chartData,
          options: {
            indexAxis: 'y',
            scales: {
              x: {
                stacked: true
              },
              y: {
                stacked: true
              }
            }
          }
        }

        let context = jQuery("#chart")
        chart = new Chart(context, config)
      })

//    $('body').animate({
//      scrollTop: $('#gpascore').offset().top
//    }, 300);

    } else { alert('1つ以上のセメスターを選択してください！'); }

  })
  
})


