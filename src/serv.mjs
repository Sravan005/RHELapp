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
    const childProcess = exec(`ansible-playbook -e "ipadr=${sshConfig.host}" -e "username=${sshConfig.username}" -e "password=${sshConfig.password}"  ~/RHELapp/testv1.yml`, function (err, stdout, stderr) {
      if (err) throw err;

      console.log('STDOUT:', stdout);
      console.log('STDERR:', stderr);

      const lines = stdout.toString().split('\n');
      lines.forEach(line => {
        const match = line.match(/RHSA-\d+:\d+/);
        if (match) {
          rhsaNumbers.push(match[0]); // Extract and store RHSA numbers
        }
      });
    });

    childProcess.on('close', function (code, signal) {
      console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
      console.log('Extracted RHSA Numbers:', rhsaNumbers);
    });
  }
}
