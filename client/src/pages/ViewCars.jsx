import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../App.css'
import { getAllCars, deleteCar } from '../services/CarsAPI'
import { formatPrice } from '../utilities/calcPrice'

const ViewCars = ({ title }) => {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        if (title) document.title = title
    }, [title])

    const load = async () => {
        try {
            setCars(await getAllCars())
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this car?')) return
        try {
            await deleteCar(id)
            setCars((prev) => prev.filter((c) => c.id !== id))
        } catch (err) {
            setError(err.message)
        }
    }

    if (loading) return <div className="page"><p className="builder-status">Loading cars…</p></div>

    return (
        <div className="page">
            <h1 className="page-title">Custom Cars 🏁</h1>
            {error && <p className="error">{error}</p>}

            {cars.length === 0 ? (
                <p className="builder-status">
                    No cars yet. <Link to="/">Build your first one!</Link>
                </p>
            ) : (
                <div className="car-grid">
                    {cars.map((car) => (
                        <article key={car.id} className="car-card">
                            <span
                                className="card-swatch"
                                style={{ background: car.exterior_color || '#888' }}
                            />
                            <div className="card-body">
                                <h3>
                                    <Link to={`/customcars/${car.id}`}>{car.name}</Link>
                                </h3>
                                <p className="card-specs">
                                    {car.exterior_name} · {car.roof_name} · {car.wheels_name} · {car.interior_name}
                                </p>
                                <p className="card-price">{formatPrice(car.price)}</p>
                            </div>
                            <div className="card-actions">
                                <button onClick={() => navigate(`/edit/${car.id}`)}>Edit</button>
                                <button className="danger" onClick={() => handleDelete(car.id)}>
                                    Delete
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ViewCars
