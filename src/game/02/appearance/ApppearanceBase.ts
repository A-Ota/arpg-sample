import { Actor } from "../actor/Actor";

export abstract class AppearanceBase {
  abstract setup (actor: Actor): void
}