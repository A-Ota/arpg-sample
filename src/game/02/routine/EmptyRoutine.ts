import { RoutineBase } from "./RoutineBase";

export class EmptyRoutine extends RoutineBase {
  *generateUpdate () {
    while (true) {
      yield
    }
  }
}
