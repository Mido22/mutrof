'use strict';

import {DIRECTIONS, ELEVATOR_REQUEST_STATES} from './utils.js'

/**
 * Elevator class
 *
 */
export default class Elevator {
  constructor({ id, floors, floor = 0, direction = DIRECTIONS.NONE, request, addressedFloor = 0}) {
    this.id = id
    this.direction = direction
    this.floors = floors  // Total number of floors in the building
    this.floor = floor
    this.addressedFloor = addressedFloor
    this.request = request  // ElevatorRequest object if it exists
  }

  /**
   * Create a new elevator object with the same state
   */
  clone() {
    return new Elevator({
      id: this.id,
      direction: this.direction,
      addressedFloor: this.addressedFloor,
      floors: this.floors,
      floor: this.floor,
      request: this.request && this.request.clone(),
    })
  }

  /**
   * Move one level (if needed) and update elevator direction
   */
  move() {

    // If elevator is responding to elevator request event
    if (this.request) {
      switch (this.request.getState()) {
        case ELEVATOR_REQUEST_STATES.WAITING_FOR_ELEVATOR:
          throw new Error('Invalid request state')
        case ELEVATOR_REQUEST_STATES.ELEVATOR_ASSIGNED:
          if (this.floor === this.addressedFloor) {
            // Change state is elevator has reached requested floor
            this.direction = this.request.getDirection()
            this.request.setState(ELEVATOR_REQUEST_STATES.DOOR_OPEN)
          } else {
            // Move elevator closer to requested floor
            moveOneFloor.call(this)
          }
          return
        case ELEVATOR_REQUEST_STATES.DOOR_OPEN:
          if (this.floor === this.addressedFloor) {
            // User has not entered a destination, close the door
            this.request.setState(ELEVATOR_REQUEST_STATES.DOOR_CLOSE)
          } else {
            // User has entered a destination, move to given floor
            this.request = null  // clear the request
            moveOneFloor.call(this)
          }
          return
        case ELEVATOR_REQUEST_STATES.DOOR_CLOSE:
          this.request = null  // clear the request
      }
    }

    moveOneFloor.call(this)
  }

  // set elevator request event
  setRequest(request) {
    if (this.isBusy())
      throw new Error('Sorry, the elevator is busy')

    if (!this.isValidFloor(request.getFloor())) 
      throw new Error('Invalid floor')

    this.request = request
    this.addressedFloor = request.getFloor()
    request.setState(ELEVATOR_REQUEST_STATES.ELEVATOR_ASSIGNED)
    switch (1) {
      case this.floor > request.getFloor():
        this.direction = DIRECTIONS.DOWN
        break
      case this.floor < request.getFloor():
        this.direction = DIRECTIONS.DOWN
        break
      default:
        this.direction = DIRECTIONS.NONE
    }
  }

  // return clone of ElevatorRequest object
  getRequest() {
    return this.request && this.request.clone()
  }

  /**
   * Check if the elevator is occupied at the moment.
   *
   * @returns {boolean} true if busy.
   */
  isBusy() {
    return !!this.request || this.direction !== DIRECTIONS.NONE
  }

  /**
   * Command to move the elevator to the given floor.
   *
   * @param {int} toFloor where to go.
   * @returns {undefined}
   */
  moveElevator(toFloor) {
    if (!this.isFloorReachableNow(toFloor)) throw new Error('Cannot move now')
    this.addressedFloor = toFloor
    setDirection.call(this)
  }

  /**
   * Check if Elevator can move to given floor at current state
   *
   * @param {int} toFloor where to go.
   * @returns {boolean}
   */
  isFloorReachableNow(toFloor) {
    if (!this.isValidFloor(toFloor) || this.floor === toFloor) return false

    const state = this.request && this.request.getState()
    if (state === ELEVATOR_REQUEST_STATES.ELEVATOR_ASSIGNED)
      return false

    switch (this.direction) {
      case DIRECTIONS.UP:
        if (this.addressedFloor >= toFloor) return false
        return true
      case DIRECTIONS.DOWN:
        if (this.addressedFloor <= toFloor) return false
      default:
        return true
    }
  }

  // Check if floor is valid
  isValidFloor(floor) {
    return floor >= 0 && floor < this.floors
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
   * Check if the elevator is occupied at the moment.
   *
   * @returns {boolean} true if busy.
   */
  isBusy() {
    return !!this.request
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

// Move elevator to requested floor
function moveOneFloor() {
  if (this.floor < this.addressedFloor)
    this.floor++
  else if (this.floor > this.addressedFloor)
    this.floor--
  setDirection.call(this)
}

// Set elevator direction
function setDirection() {
  if (this.floor < this.addressedFloor)
    this.direction = DIRECTIONS.UP
  else if (this.floor > this.addressedFloor)
    this.direction = DIRECTIONS.DOWN
  else
    this.direction = DIRECTIONS.NONE
}