import { Actor } from "../actor/Actor";

export abstract class AppearanceBase {
  abstract setup (actor: Actor): void
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  *generateUpdate (): Generator {
    while (true) {
      yield
    }
  }
}