# Elevator Simulator
This is simple elevator simulator built using React + Semantic UI. [Click here for live version](https://mido22.github.io/mutrof/)

## Project details

  * Most of it is boilerplate code taken from [here](https://github.com/pretzelhands/react-semantic-boilerplate)
  
  * Code I wrote from scratch
    - `src/api` - Business logic code
    - `src/components` - UI code
    - `src/api/test` - Unit test code
    
  * It is advisable to use the project with `yarn`
    - `yarn` - To initialize project
    - `yarn test` - To run unit tests
    - `yarn start` - To start the application
  
## Usage guide
Hopefully the application is self explanatory.

  * Up/Down button
    - `white` - Can request for elevator for given floor at given direction
    - `red` - Waiting for elevator
    - `green` - Elevator is in your floor
    
  * Elevator icon
    - Has tiny pointer denoting the direction it is moving
    - If in red color, it is busy moving to requested floor, cannot accept other requests
    - If in green color, it is opening/closing doors in a given floor