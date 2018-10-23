'use strict';

import Elevator from './Elevator.js'
import { DIRECTIONS, BUILDING_CONFIG } from './utils.js'
const elevatorList = [];
const waitQueue = [];


/**
 * Initialize elevator controller module
 * @param {Object} buildingConfig
 * @param {int} buildingConfig.elevatorCount Number of elevators in the building
 * @param {int} buildingConfig.floors Number of levels in the building
 */
export function initialize(buildingConfig) {
  // Create elevator objects and add it to list
  for (let i = 0; i < buildingConfig.elevatorCount; i++) {
    const elevator = new Elevator(i, buildingConfig.floors)
    elevatorList.push(elevator)
  }
}


/**
 * Request an elevator to the specified floor.
 *
 * @param {int} toFloor addressed floor as integer.
 * @returns {Elevator|null} The Elevator that is going to the floor, if there is one to move.
 */
export function requestElevator(toFloor) {
  return elevatorList.find((elevator) => !elevator.isBusy())
}

/**
 * A snapshot list of all elevators in the system.
 *
 * @returns {Elevator[]} A List with all {@link Elevator} objects.
 */
export function getElevators() {
  return elevatorList.map((elevator) => elevator) // return a cloned array of elevators
}

/**
 * Telling the controller that the given elevator is free for new
 * operations.
 *
 * @param {Elevator} elevator the elevator that shall be released.
 */
export function releaseElevator(elevator) {

}
