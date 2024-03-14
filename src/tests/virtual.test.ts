import { describe, it, expect, beforeEach } from "vitest";
import { Robot } from "../robot";
import {
  VirtualWheelActuator,
  VirtualWarehouse,
  VirtualWallSensor,
  VirtualPositionSensor,
} from "../virtual-warehouse";

describe("Robot and VirtualWarehouse Integration", () => {
  let robot: Robot;
  let virtualWarehouse: VirtualWarehouse;
  let northSouthWheelActuator: VirtualWheelActuator;
  let eastWestWheelActuator: VirtualWheelActuator;
  let wallSensor: VirtualWallSensor;
  let positionSensor: VirtualPositionSensor;

  beforeEach(() => {
    virtualWarehouse = new VirtualWarehouse(10, 10, [0, 0]);
    northSouthWheelActuator = new VirtualWheelActuator(virtualWarehouse, "NS");
    eastWestWheelActuator = new VirtualWheelActuator(virtualWarehouse, "EW");
    wallSensor = new VirtualWallSensor(virtualWarehouse);
    positionSensor = new VirtualPositionSensor(virtualWarehouse);

    robot = new Robot(
      wallSensor,
      positionSensor,
      northSouthWheelActuator,
      eastWestWheelActuator
    );
  });

  it("should move robot with valid commands and update position", () => {
    robot.move("N N");
    expect(virtualWarehouse.robotPosition).toEqual([0, 2]);

    robot.move("S");
    expect(virtualWarehouse.robotPosition).toEqual([0, 1]);

    robot.move("E");
    expect(virtualWarehouse.robotPosition).toEqual([1, 1]);
  });
});
