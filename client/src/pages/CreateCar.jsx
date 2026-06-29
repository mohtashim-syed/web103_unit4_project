import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'
import CarBuilder from '../components/CarBuilder'
import { createCar } from '../services/CarsAPI'

const CreateCar = ({ title }) => {
    const navigate = useNavigate()

    useEffect(() => {
        if (title) document.title = title
    }, [title])

    const handleCreate = async (car) => {
        const saved = await createCar(car)
        navigate(`/customcars/${saved.id}`)
    }

    return (
        <div className="page">
            <h1 className="page-title">Build Your Bolt Bucket ⚡</h1>
            <CarBuilder submitLabel="Save Car" onSubmit={handleCreate} />
        </div>
    )
}

export default CreateCar
