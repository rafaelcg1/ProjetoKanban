export class Task {
  constructor(
    public idTask: number,
    public title: string,
    public description: string,
    public user: string,
    public estimate: string
  ) {}
}
