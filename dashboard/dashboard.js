const myVariable = localStorage.getItem('myVariable');
const heading = document.getElementById('headi');
if (heading) {
  heading.innerHTML = `<h1>Welcome <b style="color: red; text-transform: capitalize;">${myVariable}</b>!</h1>`;

} else {
  console.error("Element with id 'heading' not found.");
}


const commonColorsRGB = ['#ff4560', '#008ffbd9', '#00e396', '#feb019'];

let chart1;
let chart2;
let chart3;

const chart1Data = [];
const chart3Data = [];

let threatLevelData = [
  { name: 'Critical', data: 0 },
  { name: 'Important', data: 0 },
  { name: 'Moderate', data: 0 },
  { name: 'Low', data: 0 }
];

const options1 = {
  series: [
    {
      name: 'Critical',
      data: chart1Data.map(item => item.data.Critical || 0),
    },
    {
      name: 'Important',
      data: chart1Data.map(item => item.data.Important || 0),
    },
    {
      name: 'Moderate',
      data: chart1Data.map(item => item.data.Moderate || 0),
    },
    {
      name: 'Low',
      data: chart1Data.map(item => item.data.Low || 0),
    },
  ],
  colors: commonColorsRGB,

  chart: {
    type: 'bar',
    width: 750,
    height: 300,
    stacked: true,
  },
  title: {
    text: 'Severity level',
    align: 'left'
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  ],
  plotOptions: {
    bar: {
      horizontal: true,
      dataLabels: {
        total: {
          enabled: true,
          offsetX: 0,
          style: {
            fontSize: '13px',
            fontWeight: 900,
          },
        },
      },
    },
  },
  xaxis: {
    categories: chart1Data.map(item => 'Year ' + item.year),

  }
};




const options2 = {
  series: threatLevelData.map(item => item.data),
  labels: threatLevelData.map(item => item.name),
  colors: commonColorsRGB,
  chart: {
    type: 'donut',
    width: 450,
    height: 350
  },
  title: {
    text: 'Severity Pie chart',
    align: 'left'
  },

  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  ]
};




const years = chart1Data.map(item => item.year);




var options3 = {
  series: [{
    name: "critical",
    data: chart3Data.map(item => item.data.Critical)
  },
  {
    name: "important",
    data: chart3Data.map(item => item.data.Important)
  },
  {
    name: "moderate",
    data: chart3Data.map(item => item.data.Moderate)
  },
  {
    name: "low",
    data: chart3Data.map(item => item.data.Low)
  }

  ],
  colors: commonColorsRGB,
  chart: {
    type: 'area',
    height: 350,
    width: 1100,
    zoom: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'straight'
  },
  title: {
    text: 'Yearwise Severity count',
    align: 'left'
  },

  //  labels: seriesData3.monthDataSeries1.dates,
  xaxis: {
    type: 'category',
    categories: chart3Data.map(item => 'Year ' + item.year),
  },
  yaxis: {
    opposite: true
  },
  legend: {
    horizontalAlign: 'left'
  }
};




document.addEventListener('DOMContentLoaded', () => {


  const chart1 = new ApexCharts(document.querySelector("#chart1"), options1);
  chart1.render();  // Render the initial state of the chart

  const chart2 = new ApexCharts(document.querySelector("#chart2"), options2);
  chart2.render();  // Render the initial state of the chart

  const chart3 = new ApexCharts(document.querySelector("#chart3"), options3);
  chart3.render();

  const sshconfigform = document.getElementById('ssh-config-form');
  const resultList = document.getElementById('result-list');
  var preloader = document.getElementById('preloader');
  const checkRHEAButton = document.getElementById('check-rhea');
  const downloadButton = document.getElementById('download-csv');
  const threatSortArrow = document.getElementById('threat-sort-arrow');
  const threatFilter = document.getElementById('threat-filter');
  const rheaTableBody = document.getElementById('rhea-table-body');
  const visualizeButton = document.getElementById('visualize');
  const backButton = document.getElementById('backbutton');


  backButton.addEventListener('click', () => {
    const charts = document.getElementById('charts');
    charts.style.display = 'none';

    backButton.style.display = 'none';

    const boxes = document.getElementById('boxes1');
    boxes.style.display = 'none';

    visualizeButton.style.display = 'block';
    downloadButton.style.display = 'block';
    document.getElementById('threat-filter-label').style.display = 'inline-block';
    document.getElementById('threat-filter').style.display = 'inline-block';

    // Show the threat boxes after setting their content
    document.getElementById('threat-box-container').style.display = 'block';
    document.getElementById('rhea-table').style.display = 'table';



  });




  sshconfigform.addEventListener('submit', function (event) {


    event.preventDefault();
    preloader.style.display = 'block';



    const host = document.getElementById('host').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const selectedButton = 'RHEL'
    const data = {
      host: host,
      username: username,
      password: password,
      selectedButton: selectedButton
    };

    // Send form data to the server
    fetch('http://3.145.113.56:3001/update-ssh-config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    fetch('http://3.145.113.56:3001/ssh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);

        document.getElementById("version").textContent = `${data.version}`;

        document.getElementById("hostname").textContent = `${data.hostname}`;

      })


    const serverInfo = {
      serverName: data.hostname,
      ipAddress: host,
      versionInfo: data.version
    };


    resultList.innerHTML = ''; // Clear previous results
    const listItem = document.createElement('li');
    listItem.className = 'server-details'; // Add a CSS class to the listItem

    listItem.innerHTML = `
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="width: 30%; text-align: right; padding-right: 10px; padding-bottom: 10px"><strong>Server name</strong></td>
                        <td><span id="hostname"></span></td>
                      </tr>
                      <tr>
                        <td style="width: 30%; text-align: right; padding-right: 10px; padding-bottom: 10px"><strong>IP Address</strong></td>
                      <td><span>${serverInfo.ipAddress}</span></td>
                      </tr>
                      <tr>
                        <td style="width: 30%; text-align: right; padding-right: 10px; padding-bottom: 10px"><strong>Version</strong></td>
                        <td><span id="version"></span></td>
                      </tr>
                    </table>
                  `;


    //listItem.textContent = data.output; // Assuming the server response has an 'output' property
    resultList.appendChild(listItem);

    fetch('http://3.145.113.56:3001/trigger-robocorp-process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}), // Add your data to be sent in the body if needed
    })

      .then(response => response.json())
      .then(postResponse => {
        console.log('POST Request Success:', postResponse);
      })

    // Show the "Check RHEA" button after clicking on a server button


    const sshConfigContainer = document.getElementById('signup');
    sshConfigContainer.style.display = 'none';

    setTimeout(() => {
      preloader.style.display = 'none';
      document.getElementById('osdetails').style.display = 'block'
      resultList.style.display = 'block';
      document.getElementById('results-heading').style.display = 'block';

    }, 5000);

  });




  checkRHEAButton.addEventListener('click', () => {

    const loadingGif = document.getElementById('underprocess');
    loadingGif.style.display = 'block';

    // // Now fetch the updated RHSA numbers
    fetch('http://3.145.113.56:3001/api')
      .then(response => response.json())
      .then(data => {
        data = Array.isArray(data[0]) ? data.flat() : data;
        console.log('The data from /api ', data);
        resultList.innerHTML = ''; // Clear previous results

        // Array to store all RHSA fetch promises
        const rowsWithData = [];
        const rowsWithNull = [];
        const successfulRows = [];
        const fetchPromises = [];
        let CriticalCount = 0;
        let importantCount = 0;
        let moderateCount = 0;
        let lowCount = 0;
        let nullcount = 0;

        data.forEach(result => {

          const fetchPromise = fetch(`http://3.145.113.56:3001/rhea/${result}`)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Error fetching data for ${result}`);
              }
              return response.json();
            })
            .then(rheaData => {

              // Extract the required fields from the JSON response for the specific RHSA entry
              const initialReleaseDate = new Date(rheaData.document.tracking.initial_release_date);
              // Extract day, month, and year components
              const day = String(initialReleaseDate.getDate()).padStart(2, '0');
              const month = String(initialReleaseDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based
              const year = initialReleaseDate.getFullYear();
              // Format date as DD-MM-YYYY
              let formattedReleaseDate = `${day}-${month}-${year}`;
              let threatDescription = rheaData.document.aggregate_severity.text;
              let description = rheaData.document.notes.find(note => note.category === 'summary').text;



              const initialReleaseYear = new Date(rheaData.document.tracking.initial_release_date).getFullYear();
              // Map threat description to appropriate series name

              const seriesName = threatDescription === 'Critical' ? 'Critical' :
                threatDescription === 'Important' ? 'Important' :
                  threatDescription === 'Moderate' ? 'Moderate' :
                    threatDescription === 'Low' ? 'Low' : 'null';


              // Find the corresponding year in chart1Data
              let yearData = chart1Data.find(item => item.year === initialReleaseYear);
              let yearData3 = chart3Data.find(item => item.year === initialReleaseYear);

              // If the yearData doesn't exist, create it
              if (!yearData) {
                yearData = { year: initialReleaseYear, data: {} };
                yearData3 = { year: initialReleaseYear, data: {} };
                chart1Data.push(yearData);
                chart3Data.push(yearData);
              }

              // Increment the count for the current series in the current year
              yearData.data[seriesName] = (yearData.data[seriesName] || 0) + 1;
              yearData3.data[seriesName] = (yearData3.data[seriesName] || 0) + 1;




              //sort by threat level filter functionality                       
              threatFilter.addEventListener('change', () => {
                const selectedThreatLevel = threatFilter.value;
                const rows = document.querySelectorAll('#rhea-table-body tr');

                // Filter rows by selected threat level
                const filteredRows = Array.from(rows).filter(row => {
                  const threatCell = row.querySelector('.threat-cell');
                  const threat = threatCell.textContent.trim();
                  return selectedThreatLevel === 'all' || threat === selectedThreatLevel;
                });

                // Sort filtered rows by threat level order: Critical > Important > Moderate > Low
                const sortedRows = filteredRows.sort((a, b) => {
                  const threatCellA = a.querySelector('.threat-cell');
                  const threatA = threatCellA.textContent.trim();
                  const threatCellB = b.querySelector('.threat-cell');
                  const threatB = threatCellB.textContent.trim();
                  const threatOrder = ['Critical', 'Important', 'Moderate', 'Low', 'null'];
                  return threatOrder.indexOf(threatA) - threatOrder.indexOf(threatB);
                });

                // Hide all rows by default
                rows.forEach(row => {
                  row.style.display = 'none';
                });

                // Display sorted rows for the selected threat level or for all threat levels
                sortedRows.forEach(row => {
                  row.style.display = '';
                });
              });

              //threat sort arrow code
              threatSortArrow.addEventListener('click', () => {
                // Sort rows based on threat level: Critical > Important > Moderate > Low
                const sortedRows = Array.from(document.querySelectorAll('#rhea-table-body tr')).sort((a, b) => {
                  const threatLevelA = a.querySelector('.threat-cell').textContent.trim();
                  const threatLevelB = b.querySelector('.threat-cell').textContent.trim();
                  const threatOrder = ['Critical', 'Important', 'Moderate', 'Low', 'null'];
                  return threatOrder.indexOf(threatLevelA) - threatOrder.indexOf(threatLevelB);
                });

                // Clear the table body
                const tableBody = document.getElementById('rhea-table-body');
                tableBody.innerHTML = '';

                // Append sorted rows to the table body
                sortedRows.forEach(row => {
                  tableBody.appendChild(row);
                });
              });

              if (threatDescription === 'Critical') {
                CriticalCount++;
              }
              if (threatDescription === 'Important') {
                importantCount++;
              } else if (threatDescription === 'Moderate') {
                moderateCount++;
              } else if (threatDescription === 'Low') {
                lowCount++;
              }




              resultList.innerHTML = ''
              //Populate the table with the extracted data
              const row = document.createElement('tr');
              row.innerHTML = `
   <td>${result}</td>
   <td class="threat-cell ${threatDescription.toLowerCase()}-cell">${threatDescription}</td>
   <td>${formattedReleaseDate}</td>
       
   <td>${description}</td>
   `;

              // rheaTableBody.appendChild(row);
              if (threatDescription === 'null') {
                rowsWithNull.push(row);
              } else {
                rowsWithData.push(row);
              }




            })






            .catch(error => {
              console.error(`Error fetching data for ${result}:`, error);
              // Handle errors if any
              nullcount++;
              const row = document.createElement('tr');
              row.innerHTML = `
              <td>${result}</td>
              <td class="threat-cell null-cell">null</td>
              <td>null</td>
              <td>null</td>
            `;
              rheaTableBody.appendChild(row);//
              rowsWithNull.push(row);
            });


          // After populating the RHEA table, display the threat level filter dropdown
          fetchPromises.push(fetchPromise);



        });


        const osdetails = document.getElementById('osdetails');
        if (osdetails) {
          osdetails.style.display = 'none';
        }
        checkRHEAButton.style.display = 'none';


        // Wait for all fetch requests to complete before populating the table
        Promise.all(fetchPromises)
          .then(() => {
            const criticalBox = document.getElementById('critical-box');
            const importantBox = document.getElementById('important-box');
            const moderateBox = document.getElementById('moderate-box');
            const lowBox = document.getElementById('low-box');
            const nullBox = document.getElementById('null-box');

            criticalBox.textContent = `Critical: ${CriticalCount}`;
            importantBox.textContent = `Important: ${importantCount}`;
            moderateBox.textContent = `Moderate: ${moderateCount}`;
            lowBox.textContent = `Low: ${lowCount}`;
            nullBox.textContent = `null: ${nullcount}`;
            loadingdone();
            loadingGif.style.display = 'none';


            const downloadButton = document.getElementById('download-csv');
            const visualizeButton = document.getElementById('visualize');
            downloadButton.style.display = 'block';
            visualizeButton.style.display = 'block';
            document.getElementById('threat-filter-label').style.display = 'inline-block';
            document.getElementById('threat-filter').style.display = 'inline-block';

            // Show the threat boxes after setting their content
            document.getElementById('threat-box-container').style.display = 'block';
            document.getElementById('rhea-table').style.display = 'table';
            const tableBody = document.getElementById('rhea-table-body');
            rowsWithData.forEach(row => tableBody.appendChild(row));
            rowsWithNull.forEach(row => tableBody.appendChild(row))

            // Append the threat box container above the rhea table
            const rheaTable = document.getElementById('rhea-table');
            rheaTable.parentNode.insertBefore(document.getElementById('threat-box-container'), rheaTable);
            checkRHEAButton.style.display = 'none';


            const seriesData3 = [
              {
                name: 'Critical',
                data: chart3Data.map(item => item.data.Critical || 0),
              },
              {
                name: 'Important',
                data: chart3Data.map(item => item.data.Important || 0),
              },
              {
                name: 'Moderate',
                data: chart3Data.map(item => item.data.Moderate || 0),
              },
              {
                name: 'Low',
                data: chart3Data.map(item => item.data.Low || 0),
              },
            ];

            // Check if chart1 is defined before updating options and rendering
            if (chart3) {
              chart3.updateOptions({
                series: seriesData3,
                xaxis: {
                  categories: chart3Data.map(item => item.year)
                }
              });

              chart3.render();
            } else {
              console.error('chart is not defined');
            }





            //chart1

            const seriesData = [
              {
                name: 'Critical',
                data: chart1Data.map(item => item.data.Critical || 0),
              },
              {
                name: 'Important',
                data: chart1Data.map(item => item.data.Important || 0),
              },
              {
                name: 'Moderate',
                data: chart1Data.map(item => item.data.Moderate || 0),
              },
              {
                name: 'Low',
                data: chart1Data.map(item => item.data.Low || 0),
              },
            ];

            // Check if chart1 is defined before updating options and rendering
            if (chart1) {
              chart1.updateOptions({
                series: seriesData,
                xaxis: {
                  categories: chart1Data.map(item => item.year)
                }
              });

              chart1.render();
            } else {
              console.error('chart1 is not defined');
            }


            //  chart2 pie chart code


            const newSeries = [
              { name: 'Critical', data: CriticalCount },
              { name: 'Important', data: importantCount },
              { name: 'Moderate', data: moderateCount },
              { name: 'Low', data: lowCount },
            ];

            // Check if chart2 is defined before updating options and rendering
            if (chart2) {
              console.log('Before updating options and rendering');
              chart2.updateOptions({
                series: newSeries.map(item => item.data),
                labels: newSeries.map(item => item.name),
              });

              chart2.render();
              console.log('After updating options and rendering');
            } else {
              console.error('chart2 is not defined');
            }



            const boxesData = [
              { type: "Critical", count: CriticalCount },
              { type: "Important", count: importantCount },
              { type: "Moderate", count: moderateCount },
              { type: "Low", count: lowCount },
            ];

            // Get the container where boxes will be added
            const boxContainer = document.getElementById("boxContainer");

            // Loop through the data and create boxes dynamically
            boxesData.forEach((data) => {
              const boxWrapper = document.createElement("div");
              boxWrapper.className = "col-md-3 mb-4";

              const box = document.createElement("div");
              box.className = `box ${data.type.toLowerCase()}`;
              box.innerHTML = `
                <h3>${data.type}</h3>
                <p>Count: ${data.count}</p>
              `;

              boxWrapper.appendChild(box);
              boxContainer.appendChild(boxWrapper);
            });






          })
      })
      .catch(error => {
        console.error('Error fetching RHSA data:', error);
      });


  })











  threatSortArrow.addEventListener('click', () => {
    // Sort rows based on threat level: Critical > Important > Moderate > Low
    const rows = document.querySelectorAll('#rhea-table-body tr');
    const sortedRows = Array.from(rows).sort((a, b) => {
      const threatLevelA = a.querySelector('.threat-cell').textContent.trim();
      const threatLevelB = b.querySelector('.threat-cell').textContent.trim();
      const threatOrder = ['Critical', 'Important', 'Moderate', 'Low'];
      return threatOrder.indexOf(threatLevelA) - threatOrder.indexOf(threatLevelB);
    });
    // Clear the table body
    const tableBody = document.getElementById('rhea-table-body');
    tableBody.innerHTML = '';

    // Append sorted rows to the table body
    sortedRows.forEach(row => {
      tableBody.appendChild(row);
    });
  });


  visualizeButton.addEventListener('click', () => {

    const charts = document.getElementById('charts');
    charts.style.display = 'block';
    backButton.style.display = 'block';

    const boxes = document.getElementById('boxes1');
    boxes.style.display = 'block';

    visualizeButton.style.display = 'none';
    downloadButton.style.display = 'none';
    document.getElementById('threat-filter-label').style.display = 'none';
    document.getElementById('threat-filter').style.display = 'none';

    // Show the threat boxes after setting their content
    document.getElementById('threat-box-container').style.display = 'none';
    document.getElementById('rhea-table').style.display = 'none';

  });



  //download as csv button functionality
  downloadButton.addEventListener('click', () => {
    // Get visible table data as an array of arrays
    const visibleRows = Array.from(document.querySelectorAll('#rhea-table-body tr')).filter(row => row.style.display !== 'none');
    const tableData = visibleRows.map(row => {
      return Array.from(row.querySelectorAll('td')).map(cell => cell.textContent);
    });
    // Add column headers to the table data
    const columnHeaders = ['Rhsa number', 'Threat', 'Release date', 'Note']; // Replace these with your actual column headers
    tableData.unshift(columnHeaders); // Add headers as the first row
    // Convert table data to formatted CSV content
    const csvContent = tableData.map(row => row.join(', ')).join('\n'); // Add a space after the comma
    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    // Create a download link and trigger the download
    const downloadLink = document.createElement('a');
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = 'rhea_data.csv';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  });




});