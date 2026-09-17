/** Klaida, kurią saugu parodyti naudotojui (žinutė lietuviškai). */
export class AppError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
    this.name = "AppError";
  }
}

/** Kai ko nors nerandam. */
export class NotFoundError extends AppError {
  constructor(what: string) {
    super(`${what} nerastas`, 404);
    this.name = "NotFoundError";
  }
}
