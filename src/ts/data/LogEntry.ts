export interface LogEntry {
  timestamp: Date;
  level: 'debug'| 'info' | 'warn' | 'error';
  message: string;
}