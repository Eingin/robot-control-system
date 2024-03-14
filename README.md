# Robot Control System

This project is a control system for a warehouse robot. The robot can move around within it's warehouse, by sensing its position and detecting walls around it while being commanded by basic string commands.

## The Robot

For the exercise I visualized the robot as a box that operates on a 2D grid. It takes commands for moving North, South, East or West in a command format that is delineated by spaces. e.g: `N E S W`

To visualize how these commands are executed this is how the robot is built:
The robot has two sets of 4 wheels, one set running in the North & South direction while the other set runs East & West. This is how it moves around.
The robot is also able to read it's environment through two sensors:

- Position sensor that provides an X, Y coordinate of the robots current position.
- Wall sensor that detects if it is currently next to the border of the warehouse on any four cardinal direction.

```
  East & West wheels
   <--->
   0   0
  +-----+
0 |     | 0 ▲
  |     |   |
  |     |   | North & South wheels
0 |     | 0 ▼
  +-----+
   0   0
```

## Installation

To get up and running with the project, follow these steps:

1. Clone the repository: `git clone https://github.com/eingin/robot-control-system.git`
2. Navigate into the project directory: `cd robot-control-system`
3. Install the dependencies: `yarn install`

## Running the App

To run the app, use the following command:

```bash
yarn start:dev
```

This will create a virtual warehouse and a robot that you can then input command strings into. After each command the state of the virtual warehouse is printed out.

## Project Structure

The project is structured in a clean architecture way and is broken down as follows:

- `robot/`: This directory contains all of the the Robot's implementation.
  - `index.ts`: This is the main file for the Robot class.
  - `core/`: This directory contains the core logic and interfaces for the Robot.
    - `actuator/`: Interfaces for the robot to manipulate it's state.
    - `constants`: Various constants that are used across the app.
    - `sensors/`: Interfaces that provide use-cases with information about the robot's environment.
    - `use-case/`: Contains the business logic for driving the robot.
- `virtual-warehouse.ts`: This contains the implementation of the VirtualWarehouse class and concrete implementations of the robot's actuators and sensors for this virtual warehouse.
- `tests/`: This directory contains all the integration tests for the project.
- `index.ts`: This is a basic CLI for interacting with the robot in a virtual warehouse.
