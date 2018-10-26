import React from 'react'
import {Field} from './components/Field'
import './App.css'

const App = () => {
    return (
        <div className="app">
            <div className="title">Tetris</div>
            <Field/>
        </div>
    )
}

export {App, App as default}
