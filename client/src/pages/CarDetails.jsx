import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import '../App.css'
import CarPreview from '../components/CarPreview'
import { getCar, deleteCar } from '../services/CarsAPI'
import { formatPrice } from '../utilities/calcPrice'

const CarDetails = ({ title }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [car, setCar] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        if (title) document.title = title
    }, [title])

    useEffect(() => {
        getCar(id).then(setCar).catch((err) => setError(err.message))
    }, [id])

    const handleDelete = async () => {
        if (!window.confirm('Delete this car?')) return
        try {
            await deleteCar(id)
            navigate('/customcars')
        } catch (err) {
            setError(err.message)
        }
    }

    if (error) return <div className="page"><p className="error">{error}</p></div>
    if (!car) return <div className="page"><p className="builder-status">Loading…</p></div>

    // Build the selection shape CarPreview expects from the joined car row.
    const selection = {
        exterior: { name: car.exterior_name, color: car.exterior_color },
        roof: { name: car.roof_name },
        wheels: { name: car.wheels_name },
        interior: { name: car.interior_name }
    }

    const specs = [
        ['Exterior', car.exterior_name],
        ['Roof', car.roof_name],
        ['Wheels', car.wheels_name],
        ['Interior', car.interior_name]
    ]

    return (
        <div className="page">
            <h1 className="page-title">{car.name}</h1>
            <div className="builder">
                <div className="builder-preview">
                    <CarPreview selection={selection} />
                    <h2 className="builder-price">{formatPrice(car.price)}</h2>
                </div>

                <div className="details-panel">
                    <table className="spec-table">
                        <tbody>
                            {specs.map(([label, value]) => (
                                <tr key={label}>
                                    <th>{label}</th>
                                    <td>{value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="card-actions">
                        <button onClick={() => navigate(`/edit/${car.id}`)}>Edit</button>
                        <button className="danger" onClick={handleDelete}>Delete</button>
                        <Link to="/customcars" role="button" className="secondary">
                            Back to all cars
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CarDetails
