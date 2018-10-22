import React from 'react'
import './Cell.css'

function Cell (props) {
    return (
        <div className={'cell ' + props.cell}></div>
    )
}

export default Cell
