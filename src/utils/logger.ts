import winston from 'winston'

class Logger {
  private logger: winston.Logger;

  constructor() {
    const transport = new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.splat(),
        winston.format.printf((info) => {
          const { timestamp, level, message, ...meta } = info;
          return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
        }),
      ),
    });
    this.logger = winston.createLogger({
      transports: [transport],
    });
  }
  info(msg: any, context?: any) {
    this.logger.info(msg, context);
  }
  warn(msg: any, context?: any) {
    this.logger.warn(msg, context);
  }
  /*
    Ideally, we would use an incident management system like Grafana Oncall or PagerDuty and page thems
    so that we can stay alerted. That's why it's a good idea to centralize error logging in one place.
    Such an incident management system would definitely be an overkill for this app though :)
  */
  error(msg: any, context?: any) {
    this.logger.error(msg, context);
  }
}

export const logger = new Logger();