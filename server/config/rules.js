/*
 * Cross-feature compatibility rules for a Bolt Bucket car.
 *
 * Each rule is a pair of option *names* that cannot appear on the same car.
 * Used by the server controller (to reject bad saves) and re-exported to the
 * client utilities so the UI can warn the user early.
 *
 * Theme: Off-Road wheels are heavy-duty and only fit under a fixed Hard Top,
 * so they conflict with the open-air roof options.
 */
export const INCOMPATIBLE_COMBOS = [
    { a: 'Off-Road 18"', b: 'Convertible' },
    { a: 'Off-Road 18"', b: 'Panoramic Glass' }
]

/**
 * Given a list of selected option names, return an array of human-readable
 * error strings for every incompatible combo found. Empty array = valid.
 */
export const findIncompatibilities = (selectedNames) => {
    const names = new Set(selectedNames.filter(Boolean))
    const errors = []

    for (const { a, b } of INCOMPATIBLE_COMBOS) {
        if (names.has(a) && names.has(b)) {
            errors.push(`"${a}" cannot be combined with "${b}".`)
        }
    }

    return errors
}
