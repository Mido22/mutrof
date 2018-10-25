import React, { Component } from 'react'
import 'rc-input-number/assets/index.css'
import InputNumber from 'rc-input-number'
import { 
  Header, Icon, Segment, Container, Grid, Divider,
  Label,
 } from 'semantic-ui-react'
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
    return (
      <Container>
        {this.renderBuildingEditor()}
        {this.renderElevatorOverview()}
      </Container>
    )
  }

  renderBuildingEditor() {

    const { floors, elevatorCount } = this.state.controller
    return (
      <Segment textAlign='center'>
        <Label key='floors'>
          <Icon name='building' />
            Number of Floors 
            <InputNumber
              value={floors}
              onChange={this.updateFloorCount}
              precision={0}
              style={{ width: 65 }}
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
              style={{ width: 65 }}
              min={1}
              max={6}
            />
        </Label>
      </Segment>
    )
  }

  renderElevatorOverview() {
    const {controller} = this.state

    return (
      <Container>
        <Header content='Elevator Overview' textAlign='center' />

        <Grid columns={controller.floors + 1}>
          {this.renderFloorLabels()}
          {this.renderFloorUpButtons()}
          {this.renderFloorDownButtons()}
          {controller.elevatorList.map((e) => this.renderElevator(e))}
        </Grid>
      </Container>
    )
  }

  renderFloorLabels() {
    const { floors } = this.state.controller
    const columns = []
    for (let i = 1; i <= floors; i++)
      columns.push(<Grid.Column textAlign='center' key={i}>
        {`Level ${i}`}
      </Grid.Column>)
    return (
      <Grid.Row key='labels'>
        {EMPTY_COLUMN}
        {columns}
      </Grid.Row>
    )
  }

  renderFloorUpButtons() {
    const { floors } = this.state.controller
    const columns = []
    for (let i = 0; i < floors; i++)
      columns.push(<Grid.Column textAlign='center' key={i}>
        <Icon name='arrow up' />
      </Grid.Column>)
    return (
      <Grid.Row key='up'>
        {EMPTY_COLUMN}
        {columns}
      </Grid.Row>
    )
  }

  renderFloorDownButtons() {
    const { floors } = this.state.controller
    const columns = []
    for (let i = 0; i < floors; i++)
      columns.push(<Grid.Column textAlign='center' key={i}>
        <Icon name='arrow down' />
      </Grid.Column>)
    return (
      <Grid.Row key='down'>
        {EMPTY_COLUMN}
        {columns}
      </Grid.Row>
    )
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