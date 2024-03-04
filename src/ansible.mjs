// import { Client } from 'ssh2';

// const sshconn = new Client();
// sshconn.on('ready', () => {
//   console.log('SSH connection established');

// });
// sshconn.connect({
//   host: '20.244.128.138',
//   username: 'kcadmin',
//   port: 22,

//   password: '$b@ON6l!524#'
// });



// export const ansibleExec = async (newConfig) => {
//     // console.log('inside-createPort');
//     let output = '';
//     let cmd  = `ansible-playbook -e "ipadr=${newConfig.host}" -e "username=${newConfig.username}" -e "password=${newConfig.password}"  /home/kcadmin/rhel/testv2.yml`;
  
//     try {
//       // Wrap the SSH execution in a Promise
//       output = await new Promise((resolve, reject) => {
//         sshconn.exec(cmd, (err, stream) => {
//           if (err) {
//             console.log('err')
//             reject(err);
//             return;
//           }
  
//           let output = '';
  
//           stream.on('close', (code, signal) => {
//             // console.log('Stream closed with code ' + code + ' and signal ' + signal);
//             resolve(output); // Resolve the Promise with the collected output
//           }).on('data', (data) => {
//             output += data;
//              console.log(output);
//           });
//         });
//       });
//     } catch (e) {
//       console.log(e);
//     }
//     return output;
// }  