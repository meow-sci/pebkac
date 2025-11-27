import { $logs } from "../../state/builder-state";

export const logger = {
  debug: (message: string) => $logs.set([...$logs.get(), { level: 'debug', message, timestamp: new Date() }]),
  info: (message: string) => $logs.set([...$logs.get(), { level: 'info', message, timestamp: new Date() }]),
  warn: (message: string) => $logs.set([...$logs.get(), { level: 'warn', message, timestamp: new Date() }]),
  error: (message: string) => $logs.set([...$logs.get(), { level: 'error', message, timestamp: new Date() }]),
};

export type Logger = typeof logger;
