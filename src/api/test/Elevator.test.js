import Elevator from '../Elevator.js'
import ElevatorRequest from '../ElevatorRequest.js'
import { DIRECTIONS, ELEVATOR_REQUEST_STATES } from '../utils.js'

let elevator, request

beforeEach(() => {
  elevator = new Elevator({
    id: 1,
    floors: 10,
    floor: 3,
    addressedFloor: 3
  })
  request = new ElevatorRequest({
    floor: 6,
    direction: DIRECTIONS.UP,
    state: ELEVATOR_REQUEST_STATES.WAITING_FOR_ELEVATOR,
  })
})

describe('clone()', () => {
  test('should be exact copy of original', () => {
    const clone = elevator.clone()
    expect(clone).toBeInstanceOf(Elevator)
    expect(clone.getId()).toBe(1)
    expect(clone.floors).toBe(10)
    expect(clone.currentFloor()).toBe(3)
    expect(clone.getAddressedFloor()).toBe(3)
    expect(clone.isBusy()).toBeFalsy()
    expect(clone.getRequest()).toBeFalsy()
    expect(clone.getDirection()).toBe(DIRECTIONS.NONE)
  })
})

describe('isBusy()', () => {
  test('When elevator is free', () => {
    expect(elevator.isBusy()).toBeFalsy()
  })

  test('When elevator has a request', () => {
    elevator.setRequest(request)
    expect(elevator.isBusy()).toBeTruthy()
  })

  test('When elevator has a request', () => {
    elevator.moveElevator(9)
    expect(elevator.isBusy()).toBeTruthy()
  })
})

describe('move()', () => {
  test('When elevator is free and moving up', () => {
    elevator = new Elevator({
      floors: 10,
      addressedFloor: 5,
      floor: 0
    })
    expect(elevator.currentFloor()).toBe(0)
    elevator.move()
    expect(elevator.currentFloor()).toBe(1)
    expect(elevator.getDirection()).toBe(DIRECTIONS.UP)
  })

  test('When elevator is free and moving down', () => {
    elevator = new Elevator({
      floors: 10,
      addressedFloor: 0,
      floor: 5
    })
    expect(elevator.currentFloor()).toBe(5)
    elevator.move()
    expect(elevator.currentFloor()).toBe(4)
    expect(elevator.getDirection()).toBe(DIRECTIONS.DOWN)
  })

  test('When elevator is free and not moving', () => {
    elevator = new Elevator({
      floors: 10,
      addressedFloor: 5,
      floor: 5
    })
    expect(elevator.currentFloor()).toBe(5)
    elevator.move()
    expect(elevator.currentFloor()).toBe(5)
    expect(elevator.getDirection()).toBe(DIRECTIONS.NONE)
  })

  test('When elevator has request', () => {
    elevator = new Elevator({
      floors: 10,
      floor: 7,
      addressedFloor: 7,
    })
    elevator.setRequest(new ElevatorRequest({
      floor: 6,
      direction: DIRECTIONS.UP,
      state: ELEVATOR_REQUEST_STATES.WAITING_FOR_ELEVATOR,
    }))
    expect(elevator.currentFloor()).toBe(7)
    expect(elevator.getAddressedFloor()).toBe(6)
    expect(elevator.getDirection()).toBe(DIRECTIONS.DOWN)
    expect(elevator.getRequest().getState()).toBe(ELEVATOR_REQUEST_STATES.ELEVATOR_ASSIGNED)
    elevator.move()

    expect(elevator.currentFloor()).toBe(6)
    expect(elevator.getDirection()).toBe(DIRECTIONS.NONE)
    expect(elevator.getRequest().getState()).toBe(ELEVATOR_REQUEST_STATES.ELEVATOR_ASSIGNED)
    elevator.move()

    expect(elevator.currentFloor()).toBe(6)
    expect(elevator.getDirection()).toBe(DIRECTIONS.UP)
    expect(elevator.getRequest().getState()).toBe(ELEVATOR_REQUEST_STATES.DOOR_OPEN)
    elevator.move()

    expect(elevator.currentFloor()).toBe(6)
    expect(elevator.getDirection()).toBe(DIRECTIONS.UP)
    expect(elevator.getRequest().getState()).toBe(ELEVATOR_REQUEST_STATES.DOOR_CLOSE)
    elevator.move()


    expect(elevator.currentFloor()).toBe(6)
    expect(elevator.getDirection()).toBe(DIRECTIONS.NONE)
    expect(elevator.getRequest()).toBeFalsy()
    elevator.move()


    expect(elevator.currentFloor()).toBe(6)
    expect(elevator.getDirection()).toBe(DIRECTIONS.NONE)
    expect(elevator.getRequest()).toBeFalsy()


  })
})

describe('setRequest()', () => {

  test('When elevator is busy', () => {
    elevator.setRequest(request)
    expect(() => elevator.setRequest(request)).toThrow()
  })

  test('When invalid floor is requested', () => {
    request = new ElevatorRequest({
      floor: 42,
      direction: DIRECTIONS.UP,
      state: ELEVATOR_REQUEST_STATES.WAITING_FOR_ELEVATOR,
    })
    expect(() => elevator.setRequest(request)).toThrow()
  })
})

describe('moveElevator()', () => {

  test('When elevator is busy', () => {
    elevator.setRequest(request)
    expect(() => elevator.moveElevator(6)).toThrow()
  })

  test('When floor is invalid', () => {
    expect(() => elevator.moveElevator(666)).toThrow()
  })

  test('When elevator is free', () => {
    expect(elevator.currentFloor()).toBe(3)
    elevator.moveElevator(7)
    elevator.move()
    expect(elevator.currentFloor()).toBe(4)
    expect(elevator.getAddressedFloor()).toBe(7)
    expect(() => elevator.moveElevator(5)).toThrow()
    elevator.moveElevator(9)
    elevator.move()
    expect(elevator.currentFloor()).toBe(5)
    expect(elevator.getAddressedFloor()).toBe(9)
  })
})