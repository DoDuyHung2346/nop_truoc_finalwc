import { spawn, spawnSync } from 'node:child_process';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const build = spawnSync(npm, ['run', 'build'], { stdio: 'inherit', shell: process.platform === 'win32' });
if (build.status !== 0) process.exit(build.status ?? 1);
const server = spawn(npm, ['run', 'start'], { stdio: 'inherit', shell: process.platform === 'win32', env: { ...process.env, PORT: '3000' } });
process.on('SIGINT', () => server.kill());
process.on('SIGTERM', () => server.kill());
