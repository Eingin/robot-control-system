import { AppError } from "../utils/app-error";
import WheelActuator from "./core/actuator/wheel-actuator";
import ControlError from "./core/constants/control-error";
import PositionSensor from "./core/sensor/position-sensor";
import WallSensor from "./core/sensor/wall-sensor";
import { ControlUseCase } from "./core/use-case/control-use-case";

export class Robot {
  private controlUseCase: ControlUseCase;

  constructor(
    positionSensor: PositionSensor,
    northSouthWheelActuator: WheelActuator,
    eastWestWheelActuator: WheelActuator,
    wallSensor: WallSensor
  ) {
    this.controlUseCase = new ControlUseCase(
      wallSensor,
      positionSensor,
      northSouthWheelActuator,
      eastWestWheelActuator
    );

    console.log("Robot online");
  }

  move(command: string): AppError<ControlError> | [number, number] {
    return this.controlUseCase.runCommands(command);
  }
}
