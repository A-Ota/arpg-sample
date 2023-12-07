import { Actor } from "../actor/Actor";

export abstract class RoutineBase {
  public actor!: Actor
  abstract update (): Generator
}