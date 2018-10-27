import React, { Component } from 'react'
import 'rc-input-number/assets/index.css'
import InputNumber from 'rc-input-number'
import { 
  Header, Icon, Container, Grid, Label,
 } from 'semantic-ui-react'

import '../css/building.css'
import ElevatorController from './../api/elevatorController.js'

const DEFAULT_FLOOR_COUNT = 10
const DEFAULT_ELEVATOR_COUNT = 4
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
            {this.renderFloor('label')}
            {this.renderFloor('up')}
            {this.renderFloor('down')}
            {elevatorList.map((e) => this.renderElevator(e))}
          </Grid>
        </Container>
      </Container>
    )
  }

  renderFloor(type) {
    const { floors } = this.state.controller
    const columns = []
    for (let i = 0; i < floors; i++)
      columns.push(
      <Grid.Column textAlign='center' key={i}> 
        {this.renderLabelOrButtonState(type, i)} 
      </Grid.Column>)

    return (
      <Grid.Row key={type}>
        {EMPTY_COLUMN}
        {columns}
      </Grid.Row>
    )
  }

  renderLabelOrButtonState(type, floor) {
    switch (type) {
      case 'label': return `Level ${floor+1}`
      case 'up': return <Icon name='arrow up' />
      case 'down': return <Icon name='arrow down' />
      default: throw new Error('Invalid type')
    }
  }

  renderElevator(elevator) {
    const { floors } = this.state.controller
    const elevatorLabel = `Lift #${elevator.getId()+1}`
    const columns = []
    for (let i = 0; i < floors; i++)
      columns.push(<Grid.Column textAlign='center' key={i}>
        <Label empty color='grey' circular />
      </Grid.Column>)
    return (
      <Grid.Row key={elevatorLabel}>
        <Grid.Column key='label'>{elevatorLabel}</Grid.Column >
        {columns}
      </Grid.Row>
    )
  }

  updateFloorCount = (floors) => {
    const controller = new ElevatorController({
      floors,
      elevatorCount: this.state.controller.elevatorCount
    })
    this.setState({ controller });
  }

  updateElevatorCount = (elevatorCount) => {
    const controller = new ElevatorController({
      elevatorCount,
      floors: this.state.controller.floors
    })
    this.setState({ controller });
  }
}