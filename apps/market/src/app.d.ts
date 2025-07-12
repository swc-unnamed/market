import type { TerminalContext } from "$lib/context/terminal.context";
import type { UserContext } from "$lib/context/user.context";

declare global {
  namespace App {
    interface Locals {
      user: UserContext;
      terminal: TerminalContext
    }
  }
}

export { };

BigInt.prototype.toJSON = function () {
  return this.toString();
}