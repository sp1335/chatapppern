import React from 'react'

function Loading() {
    return (
        <div className='d-flex loadingSpinner'>
            <svg xmlns="http://www.w3.org/2000/svg" style={{ margin: 'auto', background: 'none', display: 'block', shapeRendering: 'auto' }} width="211px" height="211px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                <path d="M9 50A41 41 0 0 0 91 50A41 41.7 0 0 1 9 50" fill="#599cff" stroke="none">
                    <animateTransform attributeName="transform" type="rotate" dur="0.5319148936170213s" repeatCount="indefinite" keyTimes="0;1" values="0 50 50.35;360 50 50.35"></animateTransform>
                </path>
            </svg>
        </div>
    )
}

export default Loading