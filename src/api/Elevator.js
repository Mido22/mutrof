'use strict';

import {DIRECTIONS} from './utils.js'

/**
 * Elevator class
 *
 */
export default class Elevator {
  constructor({id, floors, floor = 0}) {
    this.id = id
    this.direction = DIRECTIONS.NONE
    this.floor = floor
  }



  /**
   * Tells which direction is the elevator going in.
   *
   * @returns {enum} Direction Enumeration value describing the direction.
   */
  getDirection() {
    return this.direction
  }

  /**
   * If the elevator is moving. This is the target floor.
   *
   * @returns {int} primitive integer number of floor
   */
  getAddressedFloor() {
    return this.addressedFloor
  }

  /**
   * Get the Id of this elevator.
   *
   * @returns {int} primitive integer representing the elevator.
   */
  getId() {
    return this.id
  }

  /**
   * Command to move the elevator to the given floor.
   *
   * @param {int} toFloor where to go.
   * @returns {undefined}
   */
  moveElevator(toFloor) {
    
  }

  /**
   * Check if the elevator is occupied at the moment.
   *
   * @returns {boolean} true if busy.
   */
  isBusy() {
    return this.direction !== DIRECTIONS.NONE
  }

  /**
   * Reports which floor the elevator is at right now.
   *
   * @returns {int} actual floor at the moment.
   */
  currentFloor() {
    return this.floor
  }

  /**
   * Reports which floor the elevator is at right now.
   *
   * @returns {int} actual floor at the moment.
   */
  currentFloor() {
    return this.floor
  }
}
