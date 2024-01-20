const myVariable = localStorage.getItem('myVariable');

const heading = document.getElementById('headi');
if (heading) {
  heading.innerHTML = `<h1>Welcome <b style="color: red; text-transform: capitalize;">${myVariable}</b>!</h1>`;

} else {
  console.error("Element with id 'heading' not found.");
}



document.addEventListener('DOMContentLoaded', () => {

  const sshconfigform = document.getElementById('ssh-config-form');
  const resultList = document.getElementById('result-list');
  var preloader = document.getElementById('preloader');
  const checkRHEAButton = document.getElementById('check-rhea');
  const downloadButton = document.getElementById('download-csv');
  const threatSortArrow = document.getElementById('threat-sort-arrow');
  const threatFilter = document.getElementById('threat-filter');
  const rheaTableBody = document.getElementById('rhea-table-body');


  sshconfigform.addEventListener('submit', function (event) {


    event.preventDefault();
    preloader.style.display = 'block';

    // const loading = document.getElementById('loading');
    // loading.style.display = 'block';


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
    fetch('http://localhost:3001/update-ssh-config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    fetch('http://localhost:3001/ssh', {
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

     fetch('http://localhost:3001/trigger-robocorp-process', {
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
  fetch('http://localhost:3001/api')
    .then(response => response.json())
    .then(data => {

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

        const fetchPromise = fetch(`http://localhost:3001/rhea/${result}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error fetching data for ${result}`);
          }
          return response.json();
        })
          .then(rheaData => {

            // Extract the required fields from the JSON response for the specific RHSA entry
            const initialReleaseDate = new Date(rheaData.cvrfdoc.document_tracking.initial_release_date);
            // Extract day, month, and year components
            const day = String(initialReleaseDate.getDate()).padStart(2, '0');
            const month = String(initialReleaseDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based
            const year = initialReleaseDate.getFullYear();
            // Format date as DD-MM-YYYY
            let formattedReleaseDate = `${day}-${month}-${year}`;
            let threatDescription = rheaData.cvrfdoc.vulnerability[0].threats.threat.description;
            let description = rheaData.cvrfdoc.vulnerability[0].notes.note;
           

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
                const threatOrder = ['Critical', 'Important', 'Moderate', 'Low','null'];
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
                const threatOrder = ['Critical', 'Important', 'Moderate', 'Low' ,'null'];
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
          downloadButton.style.display = 'block';
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