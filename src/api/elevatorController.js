'use strict';

import Elevator from './Elevator.js'
import ElevatorRequest from './ElevatorRequest.js'
import { DIRECTIONS } from './utils.js'

export default class ElevatorController {
  /**
   * Initialize elevator controller object
   * @param {Object} buildingConfig
   * @param {int} buildingConfig.elevatorCount Number of elevators in the building
   * @param {int} buildingConfig.floors Number of levels in the building
   */
  constructor({ elevatorCount, floors, requestQueue = [] }) {
    this.floors = floors
    this.elevatorCount = elevatorCount
    this.elevatorList = []
    this.requestQueue = requestQueue
    // Create elevator objects and add it to list
    for (let i = 0; i < this.elevatorCount; i++) {
      const elevator = new Elevator(i, this.floors)
      this.elevatorList.push(elevator)
    }
    formRequestTree.call(this)
  }

  // Make a clone of elevator coontroller and it's state 
  clone(){
    const elevatorController = new ElevatorController({
      elevatorCount: this.elevatorCount,
      floors: this.floors,
      requestQueue: this.requestQueue.map((e) => e.clone())
    })
    formRequestTree.call(elevatorController)
    return elevatorController
  }

  // Request for particular direction from floor
  requestElevator(floor, direction) {
    if (this.requestTree[floor][direction])
      throw new Error('There is already a pending request')

    const request = new ElevatorRequest({ floor, direction })
    this.requestQueue.push(request)
    formRequestTree.call(this)
  }

  // Move elevator with given id to a floor
  moveElevator(elevatorId, toFloor) {
    const elevator = this.elevatorList[elevatorId]
    if (!elevator) throw new Error('Elevator not found')
    elevator.moveElevator(toFloor)
    formRequestTree.call(this)
  }

  // move all the elevators in the system, accept elevator requests, etc.
  moveElevators() {
    this.elevatorList.forEach((elevator) => elevator.move())
    clearRequests.call(this)
    formRequestTree.call(this)
  }
}

// Create a structure with all the floors and elevator requests in that floor along with their status
function formRequestTree() {
  this.requestTree = {}
  const setRequestState = (request) =>
    this.requestTree[request.getFloor()][request.getDirection()] = request.getState()

  for(let i=0; i < this.floors; i++) 
    this.requestTree[i] = {}
  
  this.requestQueue.forEach(setRequestState)
  this.elevatorList.map((elevator) => elevator.getRequest())
    .filter((request) => !!request)
    .forEach(setRequestState)
}

// This would clear as much waiting requests as possible
function clearRequests() {
  if (!this.requestQueue.length)  return
  const freeElevators = this.elevatorList.filter((elevator) => !elevator.isBusy())

  while(this.requestQueue.length && freeElevators.length) {
    const elevator = freeElevators.shift()
    const request = this.requestQueue.shift()
    elevator.setRequest(request)
  }

  //TODO: add logic to auto clear request when elevators are in that floor and moving in same direction
}