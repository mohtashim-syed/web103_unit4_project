import { pool } from '../config/database.js'
import { findIncompatibilities } from '../config/rules.js'

const FEATURE_COLUMNS = {
    exterior: 'exterior_id',
    roof: 'roof_id',
    wheels: 'wheels_id',
    interior: 'interior_id'
}

// Returns the full options rows for a set of selected ids, keyed by feature.
const loadSelectedOptions = async ({ exterior_id, roof_id, wheels_id, interior_id }) => {
    const ids = [exterior_id, roof_id, wheels_id, interior_id]
    const result = await pool.query(
        `SELECT * FROM options WHERE id = ANY($1::int[])`,
        [ids]
    )
    return result.rows
}

// Validates that all four features are present, valid, and compatible.
// Returns { error, price, names } — error is null when valid.
const validateSelection = async (body) => {
    const { exterior_id, roof_id, wheels_id, interior_id } = body

    if (!exterior_id || !roof_id || !wheels_id || !interior_id) {
        return { error: 'Please choose an option for every feature.' }
    }

    const rows = await loadSelectedOptions(body)
    if (rows.length !== 4) {
        return { error: 'One or more selected options no longer exist.' }
    }

    const names = rows.map(r => r.name)
    const incompatibilities = findIncompatibilities(names)
    if (incompatibilities.length > 0) {
        return { error: incompatibilities.join(' ') }
    }

    const price = rows.reduce((sum, r) => sum + r.price, 0)
    return { error: null, price, names }
}

// GET /api/cars
export const getCars = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT c.*,
                    ext.name AS exterior_name, ext.color AS exterior_color,
                    roof.name AS roof_name,
                    wheels.name AS wheels_name,
                    interior.name AS interior_name
             FROM cars c
             LEFT JOIN options ext      ON c.exterior_id = ext.id
             LEFT JOIN options roof     ON c.roof_id = roof.id
             LEFT JOIN options wheels   ON c.wheels_id = wheels.id
             LEFT JOIN options interior ON c.interior_id = interior.id
             ORDER BY c.id DESC`
        )
        res.status(200).json(result.rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// GET /api/cars/:id
export const getCar = async (req, res) => {
    try {
        const { id } = req.params
        const result = await pool.query(
            `SELECT c.*,
                    ext.name AS exterior_name, ext.color AS exterior_color,
                    roof.name AS roof_name,
                    wheels.name AS wheels_name,
                    interior.name AS interior_name
             FROM cars c
             LEFT JOIN options ext      ON c.exterior_id = ext.id
             LEFT JOIN options roof     ON c.roof_id = roof.id
             LEFT JOIN options wheels   ON c.wheels_id = wheels.id
             LEFT JOIN options interior ON c.interior_id = interior.id
             WHERE c.id = $1`,
            [id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Car not found' })
        }
        res.status(200).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// POST /api/cars
export const createCar = async (req, res) => {
    try {
        const { name, exterior_id, roof_id, wheels_id, interior_id } = req.body

        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Please give your car a name.' })
        }

        const validation = await validateSelection(req.body)
        if (validation.error) {
            return res.status(400).json({ error: validation.error })
        }

        const result = await pool.query(
            `INSERT INTO cars (name, exterior_id, roof_id, wheels_id, interior_id, price)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [name.trim(), exterior_id, roof_id, wheels_id, interior_id, validation.price]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// PUT /api/cars/:id
export const updateCar = async (req, res) => {
    try {
        const { id } = req.params
        const { name, exterior_id, roof_id, wheels_id, interior_id } = req.body

        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Please give your car a name.' })
        }

        const validation = await validateSelection(req.body)
        if (validation.error) {
            return res.status(400).json({ error: validation.error })
        }

        const result = await pool.query(
            `UPDATE cars
             SET name = $1, exterior_id = $2, roof_id = $3, wheels_id = $4,
                 interior_id = $5, price = $6
             WHERE id = $7 RETURNING *`,
            [name.trim(), exterior_id, roof_id, wheels_id, interior_id, validation.price, id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Car not found' })
        }
        res.status(200).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// DELETE /api/cars/:id
export const deleteCar = async (req, res) => {
    try {
        const { id } = req.params
        const result = await pool.query(
            `DELETE FROM cars WHERE id = $1 RETURNING *`,
            [id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Car not found' })
        }
        res.status(200).json({ message: 'Car deleted', car: result.rows[0] })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// GET /api/options          -> all options
// GET /api/options/:feature -> options for one feature (exterior/roof/wheels/interior)
export const getOptions = async (req, res) => {
    try {
        const { feature } = req.params
        const result = feature
            ? await pool.query(
                  `SELECT * FROM options WHERE feature = $1 ORDER BY price`,
                  [feature]
              )
            : await pool.query(`SELECT * FROM options ORDER BY feature, price`)
        res.status(200).json(result.rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export default {
    getCars,
    getCar,
    createCar,
    updateCar,
    deleteCar,
    getOptions
}
