import { RoutineBase } from "./RoutineBase";

export class EmptyRoutine extends RoutineBase {
  *update () {
    while (true) {
      yield
    }
  }
}
