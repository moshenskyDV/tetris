import React, {Component} from 'react'
import {Row} from '../Row'
import {Next} from '../Next'
import {Figures} from "../../figures";
import './Field.css'

class Field extends Component {
    constructor(props) {
        super(props)
        this.state = {
            field: [],
            currentFigure: '',
            currentFigureId: 0,
            currentFigureType: '',
            nextFigure: '',
            nextFigureId: 0,
            nextFigureType: '',
            score: 0,
            fieldWidth: 10,
            fieldHeight: 15,
            figures: [],
            interval: null,
            speed: 150,
            defaultSpeed: 150,
            fastSpeed: 10,
            gameOver: false,
            rotate: false,
            stepCounter: 0
        }
    }

    componentDidMount() {
        this.flushField()
        this.initFigures()
        this.loop()
        document.addEventListener('keydown', this.moveLeft.bind(this), false)
        document.addEventListener('keydown', this.moveRight.bind(this), false)
        document.addEventListener('keydown', this.moveDown.bind(this), false)
        document.addEventListener('keydown', this.rotate.bind(this), false)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.moveLeft.bind(this), false)
        document.removeEventListener('keydown', this.moveRight.bind(this), false)
        document.removeEventListener('keydown', this.moveDown.bind(this), false)
        document.removeEventListener('keydown', this.rotate.bind(this), false)
    }

    flushField() {
        let newField = [];
        for (let i = 0; i < this.state.fieldHeight; i++) {
            newField[i] = [];
            for (let j = 0; j < this.state.fieldWidth; j++) {
                newField[i][j] = '';
            }
        }
        this.setState({field: newField})
    }

    initFigures() {
        this.setState({figures: Figures})
    }

    moveFigure() {
        let freezeFlag = false;

        if (this.state.stepCounter % 3 === 0) {
            if (this.state.currentFigure) {
                if (!this.state.nextFigure) {
                    let randomFigure = this.state.figures[Math.floor(Math.random() * this.state.figures.length)]
                    this.setState({
                        nextFigure: randomFigure.path,
                        nextFigureId: randomFigure.id,
                        nextFigureType: randomFigure.type
                    })
                    if (this.state.speed !== this.state.defaultSpeed) {
                        this.setState({
                            speed: this.state.defaultSpeed
                        })
                        window.clearInterval(this.state.interval)
                        window.setTimeout(() => this.loop(), this.state.speed)
                        return
                    }
                }
                this.state.field.map((row, rowIndex) => {
                    row.map((cell, cellIndex) => {
                        this.state.currentFigure.map(item => {
                            if ((cell === 'fill' && (item[0] === cellIndex && item[1] + 1 === rowIndex)) || item[1] + 1 === this.state.field.length) {
                                freezeFlag = true;

                            }
                        })
                    })
                })
                if (!freezeFlag) {
                    let stepFigure = this.state.currentFigure.map((item) => {
                        return [item[0], item[1] + 1]
                    })
                    this.setState({
                        currentFigure: stepFigure
                    })
                } else {
                    this.setState({
                        currentFigure: this.state.nextFigure,
                        currentFigureId: this.state.nextFigureId,
                        currentFigureType: this.state.nextFigureType,
                        field: this.state.field.map((row) => row.map((cell) => cell === 'active' ? 'fill' : cell))
                    });
                    this.setState({
                        nextFigure: '',
                        nextFigureId: 0,
                        nextFigureType: ''
                    })
                }
            } else {
                let randomFigure = this.state.figures[Math.floor(Math.random() * this.state.figures.length)]
                this.setState({
                    currentFigure: randomFigure.path,
                    currentFigureId: randomFigure.id,
                    currentFigureType: randomFigure.type
                })
            }
        }
        if (this.state.rotate) {
            this.rotateFigure()
        }
        this.updateField()
    }

    moveLeft(e) {
        if (e.keyCode !== 37 || !this.state.currentFigure) {
            return null
        }
        let canBeShifted = true;
        this.state.currentFigure.map(item => {
            if (!(item[0] - 1 >= 0) || this.state.field[item[1]][item[0] - 1] === 'fill') {
                canBeShifted = false;
            }
        })
        if (canBeShifted) {
            this.setState({
                currentFigure: this.state.currentFigure.map(item => [item[0] - 1, item[1]])
            })
            this.updateField()
        }
    }

    moveRight(e) {
        if (e.keyCode !== 39 || !this.state.currentFigure) {
            return null
        }
        let canBeShifted = true;
        this.state.currentFigure.map(item => {
            if (!(item[0] + 1 < this.state.fieldWidth) || this.state.field[item[1]][item[0] + 1] === 'fill') {
                canBeShifted = false;
            }
        })
        if (canBeShifted) {
            this.setState({
                currentFigure: this.state.currentFigure.map(item => [item[0] + 1, item[1]])
            })
            this.updateField()
        }
    }

    moveDown(e) {
        if (e.keyCode !== 40 || !this.state.currentFigure) {
            return null
        }
        this.setState({
            speed: this.state.fastSpeed
        })
        window.clearInterval(this.state.interval)
        this.loop()
    }

    rotate(e) {
        if (e.keyCode !== 38 || !this.state.currentFigure) {
            return null
        }
        this.setState({
            rotate: true
        })
    }

    rotateFigure() {
        let defaultPath = Figures.find(figure => (figure.type === this.state.currentFigureType && figure.id === this.state.currentFigureId)).path
        let offsetLeft = this.state.currentFigure[0][0] - defaultPath[0][0]
        let offsetTop = this.state.currentFigure[0][1] - defaultPath[0][1]
        let next = Object.assign({}, Figures.find(figure => (figure.type === this.state.currentFigureType && figure.id === this.state.currentFigureId + 1)))
        if (!next.hasOwnProperty('id')) {
            next = Object.assign({}, Figures.find(figure => (figure.type === this.state.currentFigureType && figure.id === 1)))
        }
        let canBeShifted = true;
        next.path = next.path.map(item => [item[0] + offsetLeft, item[1] + offsetTop])
        next.path.map(item => {
            if (!(item[0] >= 0) || !(item[0] < this.state.fieldWidth) || this.state.field[item[1]][item[0]] === 'fill' || this.state.field[item[1]][item[0]] === 'fill') {
                canBeShifted = false;
            }
        })
        if (next && canBeShifted) {
            this.setState({
                currentFigure: next.path,
                currentFigureId: next.id,
                currentFigureType: next.type
            })
        }
    }

    updateField() {
        let activeField = this.state.field.map(row => {
            return row.map(cell => cell === 'active' ? '' : cell)
        })
        this.state.currentFigure.map(item => {
            if (activeField[item[1]][item[0]] !== 'fill') {
                activeField[item[1]][item[0]] = 'active'
            } else {
                this.finish()
            }
        })
        this.setState({
            field: activeField,
            rotate: false,
            stepCounter: this.state.stepCounter + 1
        })
    }

    finish() {
        window.clearInterval(this.state.interval)
        this.setState({
            gameOver: true
        })
    }

    flushRows() {
        let fullRows = []
        this.state.field.map((row, rowIndex) => {
            if (row.indexOf('') === -1 && row.indexOf('active') === -1) {
                fullRows.push(rowIndex)
            }
        });
        if (fullRows.length) {
            let field = this.state.field;
            fullRows.forEach(row => {
                for (let i = row; i > 0; i--) {
                    for (let j = 0; j < this.state.fieldWidth; j++) {
                        if (field[i][j] !== 'active' && field[i - 1][j] !== 'active') {
                            field[i][j] = field[i - 1][j]
                        }
                    }
                }
            })
            this.setState({
                score: this.state.score + fullRows.length * fullRows.length,
                field: field
            })
        }
    }

    loop() {
        this.setState({
            interval: window.setInterval(() => {
                this.moveFigure()
                this.flushRows()
            }, this.state.speed)
        })
    }

    render() {
        return (
            <div className="wrapper">
                <div className="field">
                    {this.state.field.map((row, i) =>
                        <Row key={i} row={row}/>
                    )}
                </div>
                <div className="aside">
                    <div className="status">{this.state.gameOver ? 'Game over' : ''}</div>
                    <div className="score">{this.state.score}</div>
                    <Next figure={this.state.nextFigure} shift={this.state.fieldWidth / 2 - 2}/>
                </div>
            </div>
        )
    }
}

export default Field
