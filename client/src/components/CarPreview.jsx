import React from 'react'

// Renders a simple SVG car whose body color, roof shape and wheel style change
// in response to the user's selections. This is the live visual preview.
const CarPreview = ({ selection }) => {
    const bodyColor = selection.exterior?.color || '#888'
    const roofName = selection.roof?.name || ''
    const wheelsName = selection.wheels?.name || ''

    const isConvertible = roofName === 'Convertible'
    const isGlassRoof = roofName === 'Panoramic Glass'

    // Wheel rim color / size cue based on the wheel option.
    const rimColor =
        wheelsName === 'Sport 19"' ? '#e63946'
        : wheelsName === 'Off-Road 18"' ? '#2a9d8f'
        : '#cccccc'
    const tireR = wheelsName === 'Off-Road 18"' ? 26 : 22

    return (
        <svg viewBox="0 0 400 200" width="100%" style={{ maxWidth: 420 }} role="img"
             aria-label="Car preview">
            {/* roof / cabin */}
            {!isConvertible && (
                <path
                    d="M110 95 L150 55 L260 55 L300 95 Z"
                    fill={isGlassRoof ? '#7fd3ff' : bodyColor}
                    stroke="#222"
                    strokeWidth="2"
                    opacity={isGlassRoof ? 0.85 : 1}
                />
            )}
            {/* windshield divider */}
            {!isConvertible && (
                <line x1="205" y1="55" x2="205" y2="95" stroke="#222" strokeWidth="2" />
            )}

            {/* body */}
            <path
                d="M60 130 L80 95 L320 95 L350 130 L350 150 L60 150 Z"
                fill={bodyColor}
                stroke="#222"
                strokeWidth="3"
            />

            {/* headlight */}
            <circle cx="343" cy="120" r="6" fill="#fff3b0" stroke="#222" />

            {/* wheels */}
            {[140, 280].map((cx) => (
                <g key={cx}>
                    <circle cx={cx} cy="150" r={tireR} fill="#1a1a1a" />
                    <circle cx={cx} cy="150" r={tireR - 9} fill={rimColor} stroke="#222" />
                </g>
            ))}
        </svg>
    )
}

export default CarPreview
