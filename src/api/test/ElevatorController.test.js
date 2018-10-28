import Elevator from '../Elevator.js'
import ElevatorRequest from '../ElevatorRequest.js'
import ElevatorController from '../ElevatorController.js'
import { DIRECTIONS, ELEVATOR_REQUEST_STATES } from '../utils.js'

const elevatorCount = 1
const floors = 3

let elevator, controller

beforeEach(() => {
  elevator = new Elevator({
    id: 0,
    floors,
    floor: 0
  })
  controller = new ElevatorController({
    elevatorCount,
    floors,
    elevators: [elevator],
    requestQueue: []
  })
})

test('clone()', () => {
  const clone = controller.clone()
  expect(clone.floors).toBe(floors)
  expect(clone.elevatorCount).toBe(elevatorCount)
})

describe('requestElevator()', () => {
  test('Floor has no requests', () => {
    controller.requestElevator(2, DIRECTIONS.DOWN)
    expect(controller.requestTree[2][DIRECTIONS.DOWN]).toBeTruthy()
  })
  test('There is already a request', () => {
    controller.requestElevator(2, DIRECTIONS.DOWN)
    expect(() => controller.requestElevator(2, DIRECTIONS.DOWN)).toThrow()
  })
  test('Request from invalid floor', () => {
    expect(() => controller.requestElevator(20, DIRECTIONS.DOWN)).toThrow()
  })
})

describe('moveElevator()', () => {
  test('Floor has no requests', () => {
    controller.moveElevator(0, 2)
    expect(controller.elevatorList[0].getAddressedFloor()).toBe(2)
  })
  test('Request from invalid floor', () => {
    expect(() => controller.moveElevator(2, 42)).toThrow()
  })
  test('Request for non-existant elevator', () => {
    expect(() => controller.moveElevator(42, 2)).toThrow()
  })
})