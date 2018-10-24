'use strict';

import { ELEVATOR_REQUEST_STATES, DIRECTIONS } from './utils.js'

/**
 * class encapsulating elevator item
 *
 */
export default class ElevatorRequest {
  constructor({ floor, direction, state = ELEVATOR_REQUEST_STATES.WAITING_FOR_ELEVATOR}) {
    if (direction !== DIRECTIONS.UP && direction !== DIRECTIONS.DOWN)
      throw new Error('Invalid request direction')
    this.direction = direction
    this.floor = floor
    this.state = state
  }

  /**
   * Create a new elevator request object with the same state
   */
  clone() {
    return new ElevatorRequest({
      direction: this.direction,
      floor: this.floor,
      state: this.state
    })
  }

  //Set Elevator state
  setState(state) {
    this.state = state
  }

  //Get Elevator state
  getState() {
    return this.state
  }

  //Get floor
  getFloor() {
    return this.floor
  }

  //Get direction
  getDirection() {
    return this.direction
  }
}