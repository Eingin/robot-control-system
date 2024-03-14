import WheelActuator from "../actuator/wheel-actuator";
import PositionSensor from "../sensor/position-sensor";
import WallSensor from "../sensor/wall-sensor";

import { Command, commands } from "../constants/command";
import ControlError from "../constants/control-error";
import { AppError, CreateAppError } from "../../../utils/app-error";

export class ControlUseCase {
  constructor(
    private readonly wallSensor: WallSensor,
    private readonly positionSensor: PositionSensor,
    private readonly northSouthWheelActuator: WheelActuator,
    private readonly eastWestWheelActuator: WheelActuator
  ) {}

  runCommands(
    commandsInput: string
  ): AppError<ControlError> | [number, number] {
    const commands = this.parseCommands(commandsInput);
    if (commands === null) {
      return CreateAppError<ControlError>(
        "An invalid command was provided. Robot has not moved.",
        "InvalidCommand"
      );
    }

    for (const command of commands) {
      const wallDetection = this.wallSensor.detectWalls();
      if (
        (command === "N" && wallDetection.north) ||
        (command === "S" && wallDetection.south) ||
        (command === "E" && wallDetection.east) ||
        (command === "W" && wallDetection.west)
      ) {
        return CreateAppError<ControlError>(
          `The robot could not move ${command}. There is a wall in the way.`,
          "WallDetected"
        );
      }

      const moveResult = this.attemptMove(command);

      if (!moveResult) {
        return CreateAppError<ControlError>(
          `The robot could not move ${command}. There was an error moving the robot.`,
          "ActuatorError"
        );
      }
    }

    return this.positionSensor.getPosition();
  }

  private parseCommands(input: string): Command[] | null {
    const cleanInput = input.trim().toUpperCase().split(" ");
    if (cleanInput.some((command) => !commands.includes(command as Command))) {
      return null;
    }

    return cleanInput as Command[];
  }

  private attemptMove(command: Command): boolean {
    switch (command) {
      case "N":
      case "S":
        return this.northSouthWheelActuator.move(
          command === "N" ? "Forward" : "Backward"
        );
      case "E":
      case "W":
        return this.eastWestWheelActuator.move(
          command === "E" ? "Forward" : "Backward"
        );
    }
  }
}
