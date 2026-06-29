import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../App.css'
import CarBuilder from '../components/CarBuilder'
import { getCar, updateCar } from '../services/CarsAPI'

const EditCar = ({ title }) => {
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

    const handleUpdate = async (updated) => {
        await updateCar(id, updated)
        navigate(`/customcars/${id}`)
    }

    if (error) return <div className="page"><p className="error">{error}</p></div>
    if (!car) return <div className="page"><p className="builder-status">Loading…</p></div>

    return (
        <div className="page">
            <h1 className="page-title">Edit “{car.name}”</h1>
            <CarBuilder initialCar={car} submitLabel="Update Car" onSubmit={handleUpdate} />
        </div>
    )
}

export default EditCar
