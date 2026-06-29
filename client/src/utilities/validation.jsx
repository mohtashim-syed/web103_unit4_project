// Client-side compatibility checks. These mirror the server rules in
// server/config/rules.js so the user gets warned before submitting.

export const INCOMPATIBLE_COMBOS = [
    { a: 'Off-Road 18"', b: 'Convertible' },
    { a: 'Off-Road 18"', b: 'Panoramic Glass' }
]

// `selection` is an object keyed by feature -> chosen option object.
// Returns an array of human-readable error strings (empty = valid).
export const getIncompatibilities = (selection) => {
    const names = new Set(
        Object.values(selection)
            .filter(Boolean)
            .map((o) => o.name)
    )

    const errors = []
    for (const { a, b } of INCOMPATIBLE_COMBOS) {
        if (names.has(a) && names.has(b)) {
            errors.push(`"${a}" cannot be combined with "${b}".`)
        }
    }
    return errors
}

// True when a candidate option would conflict with the current selection.
// Used to disable incompatible choices in the UI before submission.
export const isOptionDisabled = (candidate, selection) => {
    const names = new Set(
        Object.values(selection)
            .filter(Boolean)
            .map((o) => o.name)
    )

    return INCOMPATIBLE_COMBOS.some(({ a, b }) => {
        if (candidate.name === a) return names.has(b)
        if (candidate.name === b) return names.has(a)
        return false
    })
}
