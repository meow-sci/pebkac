export class GeneratorContext {

  public gravitational_constant: number;

  public infoLogs: string[] = [];
  public warnLogs: string[] = [];
  public errorLogs: string[] = [];

  constructor(gravitational_constant: number) {
    this.gravitational_constant = gravitational_constant;
  }

  public info(msg: string): void {
    this.infoLogs.push(msg);
  }

  public warn(msg: string): void {
    this.warnLogs.push(msg);
  }

  public error(msg: string): void {
    this.errorLogs.push(msg);
  }

}

export function createGeneratorContext(gravitationalConstant?: number): GeneratorContext {
  return new GeneratorContext(gravitationalConstant ?? 6.6743e-20); // km^3/kg/s^2
};
