const args = ['db'];
const opts = { stdio: 'inherit', cwd: '.', shell: true };
require('child_process').spawn('./internals/scripts/run.sh', args, opts);
