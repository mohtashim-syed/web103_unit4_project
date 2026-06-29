// Price helpers for a Bolt Bucket build.
//
// `selection` is an object keyed by feature -> the chosen option object
// (e.g. { exterior: {..}, roof: {..}, wheels: {..}, interior: {..} }).

export const FEATURES = ['exterior', 'roof', 'wheels', 'interior']

// Total price of all currently selected options.
export const calculateTotal = (selection) =>
    FEATURES.reduce((sum, feature) => {
        const option = selection[feature]
        return sum + (option ? Number(option.price) : 0)
    }, 0)

// Format a number as USD, e.g. 12345 -> "$12,345".
export const formatPrice = (amount) =>
    `$${Number(amount).toLocaleString('en-US')}`
