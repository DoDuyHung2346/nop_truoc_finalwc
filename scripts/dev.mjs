import { spawn } from 'node:child_process';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const children = [
  spawn(npm, ['run', 'dev', '-w', 'apps/api'], { stdio: 'inherit', shell: process.platform === 'win32', env: { ...process.env, PORT: '3001' } }),
  spawn(npm, ['run', 'dev', '-w', 'apps/web'], { stdio: 'inherit', shell: process.platform === 'win32', env: { ...process.env, PORT: '3001' } }),
];

const stop = () => children.forEach((child) => child.kill());
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
children.forEach((child) => child.on('exit', (code) => { if (code && code !== 0) { stop(); process.exitCode = code; } }));
