import React, { Component } from 'react'
import 'rc-input-number/assets/index.css'
import InputNumber from 'rc-input-number'
import { Header, Icon, Segment, Container } from 'semantic-ui-react'

import ElevatorController from './elevatorController.js'

export default class Building extends Component {
  state = {
    floors: 10,
    elevatorCount: 4
  }

  updateFloorCount = (floors) => {
    console.log('Floor # updated:', floors);
    this.setState({ floors });
  }
  updateElevatorCount = (elevatorCount) => {
    console.log('Elevator # updated:', elevatorCount);
    this.setState({ elevatorCount });
  }

  render() {

    const {floors, elevatorCount} = this.state
    return (
      <Container>

        <Segment>
          <Header textAlign='center' icon size='small'>
            <Icon name='building'/>
            <Header.Content>
              Number of Floors <InputNumber
                value={floors}
                onChange={this.updateFloorCount}
                precision={0}
                style={{ width: 65 }}
                min={1}
                max={20}
              />
            </Header.Content>
          </Header>

          <Header textAlign='center' icon size='small'>
            <Icon name='subway'/>
            <Header.Content>
              Number of Elevators <InputNumber
                value={elevatorCount}
                onChange={this.updateElevatorCount}
                precision={0}
                style={{ width: 65 }}
                min={1}
                max={6}
              />
            </Header.Content>
          </Header>
        </Segment>

        <ElevatorController floors={floors} elevatorCount={elevatorCount}/>
      </Container>
    )
  }
}