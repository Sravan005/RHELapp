import { Client } from 'ssh2';
import { ansibleExec } from './ansible.mjs';
import { exec } from 'child_process';

const conn = new Client();

let sshConfig = {
  host: '',
  username: '',
  password: '',
  readyTimeout: 6000
};


let digi = {
  host: '20.244.128.138',
  username: 'kcadmin',
  port: 22,
  password: '$b@ON6l!524#'
};




export let product = '';
export const updateSSHConfig = async (newConfig) => {

  sshConfig = newConfig;
  product = sshConfig.selectedButton;
  console.log(product);
  initiateSSHConnection();
  await ansibleExec(newConfig);
}


export const rhsaNumbers = []; // Export the array to be used in other files

export function executeCommandOnServer(command) {
  return new Promise((resolve, reject) => {
    conn.on('ready', () => {
      conn.exec(command, (err, stream) => {
        if (err) {
          conn.end();
          reject(err);
          return;
        }

        let output = '';

        stream.on('data', (data) => {
          output += data.toString();
        }).on('close', (code, signal) => {
          conn.end();
          resolve(output);
        }).stderr.on('data', (data) => {
          console.log('STDERR: ' + data);
        });
      });
    }).on('error', (err) => {
      conn.end();
      reject(err);
    }).connect(sshConfig);
  });
}




export function initiateSSHConnection() {
  conn.on('ready', function () {
    console.log('Connected via SSH');

    if (sshConfig.selectedButton === 'RHEL') {
      conn.exec(`ansible-playbook -e "ipadr=${sshConfig.host}" -e "username=${sshConfig.username}" -e "password=${sshConfig.password}"  /home/kcadmin/rhel/testvv1.yml`, function (err, stream) {
        if (err) throw err;
        console.log(sshConfig);

        stream.on('stderr', function (data) {
          console.error('STDERR: ' + data);
        });

        //node Server.mjs     
        stream.on('close', function (code, signal) {
          console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
          console.log('Extracted RHSA Numbers:', rhsaNumbers); // Print extracted RHSA numbers
          conn.end();
        }).on('data', function (data) {
          console.log('STDOUT: ansible  ' + data);
          const lines = data.toString().split('\n');
          lines.forEach(line => {
            const match = line.match(/RHSA-\d+:\d+/);
            if (match) {
              rhsaNumbers.push(match[0]); // Extract and store RHSA numbers
            }
          });
        }).stderr.on('data', function (data) {
          console.log('STDERR: ' + data);
        });
      });
    }
  })

  conn.on('error', function (err) {
    console.error('SSH Connection Error:', err);
    // Handle SSH connection errors here
  });

  // Connect only if sshConfig is not empty
  if (sshConfig.host && sshConfig.username && sshConfig.password) {
    conn.connect(digi);
  }
}

