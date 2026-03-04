/**
 * Counter for generating unique IDs
 */
let idCounter = 0;

/**
 * Generate a unique modal ID
 * @param prefix - Optional prefix for the ID
 * @returns Unique identifier string
 */
export function generateId(prefix = 'modal'): string {
  idCounter += 1;
  return `${prefix}_${idCounter}_${Date.now().toString(36)}`;
}

/**
 * Reset the ID counter (useful for testing)
 */
export function resetIdCounter(): void {
  idCounter = 0;
}
