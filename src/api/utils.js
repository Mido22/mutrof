'use strict';

export const DIRECTIONS = Object.freeze({
  UP: Symbol('up'),
  DOWN: Symbol('down'),
  NONE: Symbol('none')
});

export const ELEVATOR_REQUEST_STATES = Object.freeze({
  CAN_REQUEST_ELEVATOR: Symbol('Can Request Elevator'),
  WAITING_FOR_ELEVATOR: Symbol('Waiting for elevator'),
  ELEVATOR_ASSIGNED: Symbol('Elevator is assigned'),
  DOOR_OPEN: Symbol('Door is opening'),
  DOOR_CLOSE: Symbol('Door is closed'),
});

export const BUILDING_CONFIG= {
  floors: 10,
  elevatorCount: 6,
}