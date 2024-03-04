import { Client } from 'ssh2';
// import { ansibleExec } from './ansible.mjs';
import { exec } from 'child_process';

const conn = new Client();

let sshConfig = {
  host: '',
  username: '',
  password: '',
  readyTimeout: 6000
};


export let product = '';

export const updateSSHConfig = async (newConfig) => {

  sshConfig = newConfig;
  product = sshConfig.selectedButton;
  console.log(product);
  initiateSSHConnection();
  // await ansibleExec(newConfig);
}


export const rhsaNumbers = [];



export function initiateSSHConnection() {

  console.log('Connected via SSH');

  if (sshConfig.selectedButton === 'RHEL') {
    exec(`ansible-playbook -e "ipadr=${sshConfig.host}" -e "username=${sshConfig.username}" -e "password=${sshConfig.password}"  ~/RHELapp/testv1.yml`, function (err, stream) {
      if (err) throw err;


      stream.on('stderr', function (data) {
        console.error('STDERR: ' + data);
      });


      stream.on('close', function (code, signal) {
        console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        console.log('Extracted RHSA Numbers:', rhsaNumbers); // Print extracted RHSA numbers

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
}


