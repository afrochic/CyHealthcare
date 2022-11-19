/* globals Chart:false, feather:false */
const BASE_URL = window.location.protocol + '//' + window.location.host

const ajaxRequest = (reqType, url, data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: reqType,
      url: `${BASE_URL}${url}`,
      dataType: 'json',
      data: {
        ...data
      },
      success: function (resp) {
        resolve(resp)
      },
      error: (xhr, status, error) => {
        reject(error)
      }
    });
  })
}





let chart;
let day = '2020-06-02';
let country = 'USA';


let initGraph  = async () => {
  'use strict'

  feather.replace({ 'aria-hidden': 'true' })

  // Graphs
  const ctx = document.getElementById('myChart')
  // eslint-disable-next-line no-unused-vars

  try {
    const response = await ajaxRequest('GET', `/covid/history?country=${country}&day=${day}`)
     return new Chart(ctx, {
      type: 'line',
      data: {
        labels: response.labels,
        datasets: [{
          label: 'Cases',
          data: response.cases,
          lineTension: 0,
          backgroundColor: 'transparent',
          borderColor: '#007bff',
          borderWidth: 4,
          pointBackgroundColor: '#007bff'
        },
        {
          label: 'Deaths',
          data: response.deaths,
          lineTension: 0,
          backgroundColor: 'transparent',
          borderColor: '#00bf8f',
          borderWidth: 4,
          pointBackgroundColor: '#00bf8f'
        },{
          label: 'Tests',
          data: response.tests,
          lineTension: 0,
          backgroundColor: 'transparent',
          borderColor: '#F27121',
          borderWidth: 4,
          pointBackgroundColor: '#F27121'
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false
            }
          }]
        },
        legend: {
          display: true
        }
      }
    })

  } catch (error) {
    console.log(error)
  }
}

//Run init graph automatically
(async() => {
 chart =  await initGraph()
})()


const countrySelect = $('#country-select')
countrySelect.val(country)
countrySelect.change(async function () {
  const c = $(this).val()
  country = c
  await initGraph()
})

const datePicker = $('#date')
datePicker.val(day)
datePicker.change(async function () {
  const date = $(this).val()
  day = date
 await initGraph()
})


const tabItems = document.querySelectorAll('[data-tab-item]')

const removeActiveTabIndicator = () => {
    tabItems.forEach(tab => {
        tab.classList.remove('active')
    })
}

removeActiveTabIndicator()


let pathname = window.location.pathname

if (pathname.includes('/covid/graph')) {
  tabItems[0].classList.add('active')
}

if (pathname.includes('/covid/table')) {
  tabItems[1].classList.add('active')
}


