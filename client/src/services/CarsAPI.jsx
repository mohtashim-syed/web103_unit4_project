const BASE = '/api'

// Small helper that parses JSON and throws the server's error message on failure.
const request = async (url, options = {}) => {
    const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
    }
    return data
}

// ----- options (customizable features) -----

export const getAllOptions = () => request(`${BASE}/options`)

export const getOptionsByFeature = (feature) =>
    request(`${BASE}/options/${feature}`)

// ----- cars (saved custom builds) -----

export const getAllCars = () => request(`${BASE}/cars`)

export const getCar = (id) => request(`${BASE}/cars/${id}`)

export const createCar = (car) =>
    request(`${BASE}/cars`, {
        method: 'POST',
        body: JSON.stringify(car)
    })

export const updateCar = (id, car) =>
    request(`${BASE}/cars/${id}`, {
        method: 'PUT',
        body: JSON.stringify(car)
    })

export const deleteCar = (id) =>
    request(`${BASE}/cars/${id}`, {
        method: 'DELETE'
    })

export default {
    getAllOptions,
    getOptionsByFeature,
    getAllCars,
    getCar,
    createCar,
    updateCar,
    deleteCar
}
