import { pool } from './database.js'
import dotenv from 'dotenv'

dotenv.config()

/*
 * Bolt Bucket data model
 * ----------------------
 * `options`  - every customizable choice for a car. Each option belongs to a
 *              feature ("exterior", "roof", "wheels", "interior"), has a price,
 *              and may carry a `color` (used to visually change the rendered car)
 *              or a `label` style hint.
 * `cars`     - a saved custom car. It references one option per feature and
 *              stores the computed total price and a name.
 *
 * Some option combinations are physically impossible (see INCOMPATIBLE_COMBOS
 * in the controller / client validation utilities). The schema itself just
 * stores choices; validity is enforced in the controller before insert/update.
 */

const OPTIONS = [
    // feature, name, price, color (hex for visual change), description
    ['exterior', 'Lightning Red',    1000, '#d7263d', 'Classic bold red finish'],
    ['exterior', 'Electric Blue',    1200, '#1b6ca8', 'Vivid metallic blue'],
    ['exterior', 'Midnight Black',   1500, '#1a1a1a', 'Deep gloss black'],
    ['exterior', 'Pearl White',      1300, '#f2f2f2', 'Pearlescent white'],
    ['exterior', 'Solar Yellow',     1100, '#f4d35e', 'High-visibility yellow'],

    ['roof',     'Hard Top',          800, null,      'Standard fixed roof'],
    ['roof',     'Panoramic Glass',  2200, null,      'Full glass moonroof'],
    ['roof',     'Convertible',      3500, null,      'Retractable soft top'],

    ['wheels',   'Standard 17"',      600, null,      'All-season alloy wheels'],
    ['wheels',   'Sport 19"',        1400, null,      'Performance low-profile'],
    ['wheels',   'Off-Road 18"',     1800, null,      'Rugged all-terrain'],

    ['interior', 'Cloth Gray',        500, null,      'Durable cloth seating'],
    ['interior', 'Leather Tan',      1600, null,      'Premium tan leather'],
    ['interior', 'Sport Bucket',     2000, null,      'Racing bucket seats']
]

const createTables = async () => {
    const query = `
        DROP TABLE IF EXISTS cars;
        DROP TABLE IF EXISTS options;

        CREATE TABLE options (
            id SERIAL PRIMARY KEY,
            feature VARCHAR(50) NOT NULL,
            name VARCHAR(100) NOT NULL,
            price INTEGER NOT NULL,
            color VARCHAR(20),
            description TEXT
        );

        CREATE TABLE cars (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            exterior_id INTEGER REFERENCES options(id),
            roof_id INTEGER REFERENCES options(id),
            wheels_id INTEGER REFERENCES options(id),
            interior_id INTEGER REFERENCES options(id),
            price INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );
    `

    try {
        await pool.query(query)
        console.log('🎉 tables created successfully')
    } catch (err) {
        console.error('⚠️ error creating tables', err)
    }
}

const seedOptions = async () => {
    try {
        for (const [feature, name, price, color, description] of OPTIONS) {
            await pool.query(
                `INSERT INTO options (feature, name, price, color, description)
                 VALUES ($1, $2, $3, $4, $5)`,
                [feature, name, price, color, description]
            )
        }
        console.log('🌱 options seeded successfully')
    } catch (err) {
        console.error('⚠️ error seeding options', err)
    }
}

const reset = async () => {
    await createTables()
    await seedOptions()
    await pool.end()
}

reset()
