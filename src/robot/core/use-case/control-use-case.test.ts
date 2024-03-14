import { describe, it, expect, beforeEach } from "vitest";
import { mock, mockReset } from "vitest-mock-extended";

import { ControlUseCase } from "./control-use-case";
import WallSensor from "../sensor/wall-sensor";
import WheelActuator from "../actuator/wheel-actuator";
import PositionSensor from "../sensor/position-sensor";
import { isAppError } from "../../../utils/app-error";
import ControlError from "../constants/control-error";

describe("ControlUseCase", () => {
  const mockWallSensor = mock<WallSensor>();
  const mockPositionSensor = mock<PositionSensor>();
  const mockNorthSouthWheelActuator = mock<WheelActuator>();
  const mockEastWestWheelActuator = mock<WheelActuator>();

  let controlUseCase: ControlUseCase;

  beforeEach(() => {
    mockReset(mockWallSensor);
    mockReset(mockPositionSensor);
    mockReset(mockNorthSouthWheelActuator);
    mockReset(mockEastWestWheelActuator);

    controlUseCase = new ControlUseCase(
      mockWallSensor,
      mockPositionSensor,
      mockNorthSouthWheelActuator,
      mockEastWestWheelActuator
    );
  });

  it("should create an instance", () => {
    expect(controlUseCase).toBeTruthy();
  });

  it.each(["N W S E", "N N", "S E W N"])(
    "should parse and action valid command successfully: %s",
    (command) => {
      mockWallSensor.detectWalls.mockReturnValue({
        north: false,
        south: false,
        east: false,
        west: false,
      });

      const mockPosition: [number, number] = [1, 1];

      mockPositionSensor.getPosition.mockReturnValue(mockPosition);

      mockNorthSouthWheelActuator.move.mockReturnValue(true);
      mockEastWestWheelActuator.move.mockReturnValue(true);

      const result = controlUseCase.runCommands(command);
      expect(mockWallSensor.detectWalls).toHaveBeenCalled();
      expect(mockPositionSensor.getPosition).toHaveBeenCalled();
      expect(result).toEqual(mockPosition);
    }
  );

  it.each(["N W S X", "ufhwuhf892", "N [][]", "1N 2S 3W"])(
    "should return app error and not call actuators on invalid command: %s",
    (command) => {
      const result = controlUseCase.runCommands(command);

      expect(mockNorthSouthWheelActuator.move).not.toHaveBeenCalled();
      expect(mockEastWestWheelActuator.move).not.toHaveBeenCalled();
      expect(isAppError(result)).toBeTruthy();
    }
  );

  it.each([
    ["Forward", "N"],
    ["Backward", "S"],
  ])(
    "should call northSouthWheelActuator.move with: %s when using command: %s",
    (result, command) => {
      mockWallSensor.detectWalls.mockReturnValueOnce({
        north: false,
        south: false,
        east: false,
        west: false,
      });
      controlUseCase.runCommands(command);
      expect(mockNorthSouthWheelActuator.move).toHaveBeenCalledWith(result);
    }
  );

  it.each([
    ["Forward", "E"],
    ["Backward", "W"],
  ])(
    "should call eastWestWheelActuator.move with: %s when using command: %s",
    (result, command) => {
      mockWallSensor.detectWalls.mockReturnValueOnce({
        north: false,
        south: false,
        east: false,
        west: false,
      });
      controlUseCase.runCommands(command);
      expect(mockEastWestWheelActuator.move).toHaveBeenCalledWith(result);
    }
  );

  it.each([
    {
      walls: { north: true, south: false, east: false, west: false },
      command: "N",
    },
    {
      walls: { north: false, south: true, east: false, west: false },
      command: "S",
    },
    {
      walls: { north: false, south: false, east: true, west: false },
      command: "E",
    },
    {
      walls: { north: false, south: false, east: false, west: true },
      command: "W",
    },
  ])(
    "should not call actuators when wall sensor indicates a boundary for $command",
    ({ walls, command }) => {
      mockWallSensor.detectWalls.mockReturnValueOnce(walls);

      const result = controlUseCase.runCommands(command);
      expect(mockNorthSouthWheelActuator.move).not.toHaveBeenCalled();
      expect(mockEastWestWheelActuator.move).not.toHaveBeenCalled();
      expect(isAppError<ControlError>(result)).toBeTruthy();
      const isBoundary =
        isAppError<ControlError>(result) && result.type === "WallDetected";
      expect(isBoundary).toBeTruthy();
    }
  );
});
