import React, { Component } from 'react'
import { Header, Icon, Segment } from 'semantic-ui-react'

export default class ElevatorController extends Component {
  state = {
  }

  render() {

    const { floors, elevatorCount } = this.props
    return (
      <Segment>
        <Header content='Elevator Overview' textAlign='center'/>
        Floors in the building: {floors}
        Elevators in the building: {elevatorCount}
      </Segment>
    )
  }
}