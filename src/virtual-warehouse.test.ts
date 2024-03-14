import { describe, it, expect, beforeEach } from "vitest";

import {
  VirtualWheelActuator,
  VirtualWarehouse,
  VirtualWallSensor,
  VirtualPositionSensor,
} from "./virtual-warehouse";
import Direction from "./robot/core/constants/direction";

describe("VirtualWheelActuator", () => {
  let virtualWarehouse: VirtualWarehouse;

  beforeEach(() => {
    virtualWarehouse = new VirtualWarehouse(10, 10, [0, 0]);
  });

  it("should create an instance", () => {
    expect(virtualWarehouse).toBeTruthy();
  });

  it.each([
    { axis: "NS", direction: "Forward", expectedPosition: [0, 1] },
    { axis: "NS", direction: "Backward", expectedPosition: [0, -1] },
    { axis: "EW", direction: "Forward", expectedPosition: [1, 0] },
    { axis: "EW", direction: "Backward", expectedPosition: [-1, 0] },
  ])(
    "should move robot in the correct direction: %s",
    ({ axis, direction, expectedPosition }) => {
      const virtualWheelActuator = new VirtualWheelActuator(
        virtualWarehouse,
        axis as "NS" | "EW"
      );
      virtualWheelActuator.move(direction as Direction);
      expect(virtualWarehouse.robotPosition).toEqual(expectedPosition);
    }
  );
});

describe("VirtualWallSensor", () => {
  let virtualWarehouse: VirtualWarehouse;

  beforeEach(() => {
    virtualWarehouse = new VirtualWarehouse(10, 10, [0, 0]);
  });

  it.each([
    [[0, 0], { north: false, south: true, east: false, west: true }],
    [[0, 9], { north: true, south: false, east: false, west: true }],
    [[9, 0], { north: false, south: true, east: true, west: false }],
    [[9, 9], { north: true, south: false, east: true, west: false }],
    [[0, 5], { north: false, south: false, east: false, west: true }],
    [[5, 0], { north: false, south: true, east: false, west: false }],
    [[9, 5], { north: false, south: false, east: true, west: false }],
    [[5, 9], { north: true, south: false, east: false, west: false }],
    [[5, 5], { north: false, south: false, east: false, west: false }],
  ])("should detect walls correctly for position %s", (position, walls) => {
    const virtualWallSensor = new VirtualWallSensor(virtualWarehouse);
    virtualWarehouse.robotPosition = position as [number, number];
    expect(virtualWallSensor.detectWalls()).toEqual(walls);
  });
});

describe("VirtualPositionSensor", () => {
  let virtualWarehouse: VirtualWarehouse;

  beforeEach(() => {
    virtualWarehouse = new VirtualWarehouse(10, 10, [0, 0]);
  });

  it("should return the robot's position", () => {
    const virtualPositionSensor = new VirtualPositionSensor(virtualWarehouse);
    expect(virtualPositionSensor.getPosition()).toEqual([0, 0]);
  });
});
