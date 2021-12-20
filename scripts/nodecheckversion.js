const { exec } = require('child_process');

const MAX_NODE_VERSION = '10';

exec('node -v', (err, stdout) => {
  if (err) throw err;
  const version = stdout.replace(/v|V/g, '');
  // console.log(stdout, version);
  if (parseInt(version) > MAX_NODE_VERSION) {
    // NOTE: This can happen if you have a dependency which lists an old version of npm in its own dependencies.
    throw new Error(`[ERROR] You need node version @<=${MAX_NODE_VERSION} but you have ${stdout}`);
  }
});
