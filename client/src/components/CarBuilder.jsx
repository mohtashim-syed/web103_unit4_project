import React, { useState, useEffect } from 'react'
import { getAllOptions } from '../services/CarsAPI'
import { FEATURES, calculateTotal, formatPrice } from '../utilities/calcPrice'
import { getIncompatibilities, isOptionDisabled } from '../utilities/validation'
import CarPreview from './CarPreview'

const FEATURE_LABELS = {
    exterior: 'Exterior',
    roof: 'Roof',
    wheels: 'Wheels',
    interior: 'Interior'
}

/*
 * Shared form used by both CreateCar and EditCar.
 *
 * Props:
 *  - initialCar: optional saved car row (with *_id fields + name) to pre-fill
 *  - submitLabel: text for the submit button
 *  - onSubmit({ name, exterior_id, roof_id, wheels_id, interior_id }): async fn
 */
const CarBuilder = ({ initialCar, submitLabel = 'Save Car', onSubmit }) => {
    const [optionsByFeature, setOptionsByFeature] = useState({})
    const [selection, setSelection] = useState({}) // feature -> option object
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const load = async () => {
            try {
                const all = await getAllOptions()
                const grouped = {}
                for (const opt of all) {
                    grouped[opt.feature] = grouped[opt.feature] || []
                    grouped[opt.feature].push(opt)
                }
                setOptionsByFeature(grouped)

                // Pre-fill from initialCar (edit) or default to first option each.
                const initialSelection = {}
                for (const feature of FEATURES) {
                    const list = grouped[feature] || []
                    if (initialCar) {
                        const id = initialCar[`${feature}_id`]
                        initialSelection[feature] =
                            list.find((o) => o.id === id) || list[0]
                    } else {
                        initialSelection[feature] = list[0]
                    }
                }
                setSelection(initialSelection)
                if (initialCar) setName(initialCar.name)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [initialCar])

    const chooseOption = (feature, option) => {
        setSelection((prev) => ({ ...prev, [feature]: option }))
        setError('')
    }

    const incompatibilities = getIncompatibilities(selection)
    const total = calculateTotal(selection)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!name.trim()) {
            setError('Please give your car a name.')
            return
        }
        if (incompatibilities.length > 0) {
            setError(incompatibilities.join(' '))
            return
        }

        setSaving(true)
        try {
            await onSubmit({
                name: name.trim(),
                exterior_id: selection.exterior?.id,
                roof_id: selection.roof?.id,
                wheels_id: selection.wheels?.id,
                interior_id: selection.interior?.id
            })
        } catch (err) {
            setError(err.message)
            setSaving(false)
        }
    }

    if (loading) return <p className="builder-status">Loading options…</p>

    return (
        <div className="builder">
            <div className="builder-preview">
                <CarPreview selection={selection} />
                <h2 className="builder-price">{formatPrice(total)}</h2>
            </div>

            <form className="builder-form" onSubmit={handleSubmit}>
                <label>
                    Car Name
                    <input
                        type="text"
                        value={name}
                        placeholder="e.g. My Dream Ride"
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>

                {FEATURES.map((feature) => (
                    <fieldset key={feature} className="feature-group">
                        <legend>{FEATURE_LABELS[feature]}</legend>
                        <div className="option-list">
                            {(optionsByFeature[feature] || []).map((option) => {
                                const selected = selection[feature]?.id === option.id
                                const disabled =
                                    !selected && isOptionDisabled(option, selection)
                                return (
                                    <button
                                        type="button"
                                        key={option.id}
                                        className={`option-btn${selected ? ' selected' : ''}`}
                                        disabled={disabled}
                                        title={disabled ? 'Incompatible with current selection' : option.description}
                                        onClick={() => chooseOption(feature, option)}
                                    >
                                        {option.color && (
                                            <span
                                                className="swatch"
                                                style={{ background: option.color }}
                                            />
                                        )}
                                        <span className="option-name">{option.name}</span>
                                        <span className="option-price">
                                            {formatPrice(option.price)}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </fieldset>
                ))}

                {incompatibilities.length > 0 && (
                    <p className="warn" role="alert">⚠️ {incompatibilities.join(' ')}</p>
                )}
                {error && <p className="error" role="alert">{error}</p>}

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={saving || incompatibilities.length > 0}
                >
                    {saving ? 'Saving…' : submitLabel}
                </button>
            </form>
        </div>
    )
}

export default CarBuilder
