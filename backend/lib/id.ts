import { ulid } from "@std/ulid";

/**
 * Naujas ID. ULID, o ne atsitiktinis UUID, nes ULID'ai rikiuojasi
 * pagal sukūrimo laiką – tai reiškia, kad KV grąžina įrašus
 * teisinga tvarka be jokio papildomo rikiavimo.
 */
export function newId(): string {
  return ulid();
}
