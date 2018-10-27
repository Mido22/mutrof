import React, { Component } from 'react'
import 'rc-input-number/assets/index.css'
import InputNumber from 'rc-input-number'
import {
  Header, Icon, Container, Grid, Label, Button,

} from 'semantic-ui-react'

import '../css/building.css'
import ElevatorController from './../api/elevatorController.js'
import { ELEVATOR_REQUEST_STATES, DIRECTIONS } from '../api/utils.js'

const noop = () => { }
const DEFAULT_FLOOR_COUNT = 10
const DEFAULT_ELEVATOR_COUNT = 4
const DEFAULT_INTERVAL = 3
const EMPTY_COLUMN = (<Grid.Column key='empty'></Grid.Column>)

export default class Building extends Component {
  state = {
    controller: new ElevatorController({
      floors: DEFAULT_FLOOR_COUNT,
      elevatorCount: DEFAULT_ELEVATOR_COUNT,
    }),
  }

  render() {
    const { floors, elevatorCount, elevatorList } = this.state.controller

    return (
      <Container>
        <Header as='h1' size='large' textAlign='center' inverted>
          <Icon name='sliders' rotated='clockwise' />
          Elevator Simulator
        </Header>

        <Container textAlign='center' className='building-settings'>
          <Label key='floors'>
            <Icon name='building' />
            Number of Floors
            <InputNumber
              value={floors}
              onChange={this.updateFloorCount}
              precision={0}
              className='setting-input'
              min={1}
              max={14}
            />
          </Label>

          <Label key='Elevators'>
            <Icon name='subway' />
            Number of Elevators
            <InputNumber
              value={elevatorCount}
              onChange={this.updateElevatorCount}
              precision={0}
              className='setting-input'
              min={1}
              max={6}
            />
          </Label>
        </Container>

        <Container>
          <Grid columns={floors + 1}>
            {this.renderFloor('label', 1)}
            {this.renderFloor(DIRECTIONS.UP, 2)}
            {this.renderFloor(DIRECTIONS.DOWN, 3)}
            {elevatorList.map((e) => this.renderElevator(e))}
          </Grid>
        </Container>
      </Container>
    )
  }

  renderFloor(type, renderKey) {
    const { floors } = this.state.controller
    const columns = []
    for (let i = 0; i < floors; i++)
      columns.push(
        <Grid.Column textAlign='center' key={i}>
          {this.renderLabelOrButtonState(type, i)}
        </Grid.Column>)

    return (
      <Grid.Row key={renderKey}>
        {EMPTY_COLUMN}
        {columns}
      </Grid.Row>
    )
  }

  renderLabelOrButtonState(type, floor) {
    let buttonName
    let handler = noop
    let buttonColor
    let buttonClass = ''
    const { controller } = this.state

    switch (type) {
      case 'label': 
        return `Level ${floor + 1}`
      case DIRECTIONS.UP: 
        buttonName = 'arrow up'
        if (floor+1 === controller.floors)  return ''
        break
      case DIRECTIONS.DOWN:
        buttonName = 'arrow down'
        if (floor === 0) return ''
        break
      default: 
        throw new Error('Invalid type')
    }

    const buttonState = controller.requestTree[floor][type]

    switch (buttonState) {
      case ELEVATOR_REQUEST_STATES.WAITING_FOR_ELEVATOR:
      case ELEVATOR_REQUEST_STATES.ELEVATOR_ASSIGNED:
        buttonColor = 'red'
        buttonClass = 'mutrof-blink'
        break
      case ELEVATOR_REQUEST_STATES.DOOR_OPEN:
      case ELEVATOR_REQUEST_STATES.DOOR_CLOSE:
        buttonColor = 'green'
        buttonClass = 'mutrof-blink'
        break
      case ELEVATOR_REQUEST_STATES.CAN_REQUEST_ELEVATOR:
      default:
        handler = () => { controller.requestElevator(floor, type); this.updateState(controller) }
    }

    const isButonDisabled = handler === noop

    return <Button icon={buttonName} disabled={isButonDisabled} color={buttonColor} onClick={handler} className={buttonClass} circular compact />
  }

  renderElevator(elevator) {
    const { floors } = this.state.controller
    const elevatorLabel = `Lift #${elevator.getId() + 1}`
    const columns = []
    for (let i = 0; i < floors; i++)
      columns.push(<Grid.Column textAlign='center' key={i}>
        {(i === elevator.currentFloor()) ? this.renderElevatorIcon(elevator) : this.renderElevatorFloor(elevator, i)}
      </Grid.Column>)
    return (
      <Grid.Row key={elevatorLabel}>
        <Grid.Column key='label'>{elevatorLabel}</Grid.Column >
        {columns}
      </Grid.Row>
    )
  }

  renderElevatorIcon(elevator) {
    let includeLeft
    let includeRight
    let buttonClass
    let buttonColor
    const request = elevator.getRequest()
    const requestState = request ? request.getState() : null

    switch (requestState) {
      case ELEVATOR_REQUEST_STATES.WAITING_FOR_ELEVATOR:
      case ELEVATOR_REQUEST_STATES.ELEVATOR_ASSIGNED:
        buttonColor = 'red'
        buttonClass = 'mutrof-blink'
        break
      case ELEVATOR_REQUEST_STATES.DOOR_OPEN:
      case ELEVATOR_REQUEST_STATES.DOOR_CLOSE:
        buttonColor = 'green'
        buttonClass = 'mutrof-blink'
        break
      case ELEVATOR_REQUEST_STATES.CAN_REQUEST_ELEVATOR:
      default:
    }

    switch (elevator.getDirection()) {
      case DIRECTIONS.UP:
        includeRight = <Icon name='angle right' size='mini' color={buttonColor} />
        break
      case DIRECTIONS.DOWN:
        includeLeft = <Icon name='angle left' size='mini' color={buttonColor} />
        break
    }

    return (<div>
      {includeLeft}
      <Icon name='subway' size='large' color={buttonColor} className={buttonClass} />
      {includeRight}
    </div>)
  }

  renderElevatorFloor(elevator, floor) {
    let handler
    let buttonColor = 'white'
    let buttonClass
    const {controller} = this.state
    
    if (floor === elevator.getAddressedFloor()) {
      buttonColor = 'red'
      buttonClass = 'mutrof-blink'
    } else if (elevator.isFloorReachableNow(floor)) {
      handler = () => { controller.moveElevator(elevator.getId(), floor); this.updateState(controller) }
    }

    return <Button color={buttonColor} disabled={!handler} onClick={handler} className={buttonClass} circular compact />
  }

  updateFloorCount = (floors) => {
    const controller = new ElevatorController({
      floors,
      elevatorCount: this.state.controller.elevatorCount
    })
    this.setState({ controller })
  }

  updateElevatorCount = (elevatorCount) => {
    const controller = new ElevatorController({
      elevatorCount,
      floors: this.state.controller.floors
    })
    this.setState({ controller })
  }

  updateState = (controller) => {
    this.setState({ controller: controller.clone() })
  }

  moveElevators() {
    const { controller } = this.state
    controller.moveElevators()
    this.updateState(controller)
  }

  componentDidMount() {
    this.interval = setInterval(() => this.moveElevators(), DEFAULT_INTERVAL * 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }
}