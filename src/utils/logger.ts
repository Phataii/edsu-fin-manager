import logfmt from 'logfmt';

const getTimestamp = () => new Date().toISOString().replace('T', ' ').replace('Z', '');

class Logger {
  name: string;

  constructor (service: string) {
    this.name = service;
  }

  log(message: string, opts: object) {
    const logData = logfmt.stringify(Object.assign(opts, { component: this.name }));
    process.stdout.write(`[${getTimestamp()}] ${message} ${logData}` + '\n');
  }

  error(message: string, opts: object) {
    const logData = logfmt.stringify(Object.assign(opts, { component: this.name }));
    process.stderr.write(`[${getTimestamp()}] ${message} ${logData}` + '\n');
  }
}

export default Logger;
