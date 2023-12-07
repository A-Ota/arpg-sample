import { Actor } from "../actor/Actor";

export abstract class RoutineBase {
  public actor!: Actor
  abstract generateUpdate (): Generator
}