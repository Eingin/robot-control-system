import WheelActuator from "./robot/core/actuator/wheel-actuator";
import Direction from "./robot/core/constants/direction";
import PositionSensor from "./robot/core/sensor/position-sensor";
import WallSensor from "./robot/core/sensor/wall-sensor";

export class VirtualWarehouse {
  robotPosition: [number, number];

  constructor(
    readonly width: number,
    readonly height: number,
    robotStartPos: [number, number]
  ) {
    this.robotPosition = robotStartPos;
  }

  print(): string {
    let result = "";
    for (let y = this.height - 1; y >= 0; y--) {
      for (let x = 0; x < this.width; x++) {
        if (this.robotPosition[0] === x && this.robotPosition[1] === y) {
          result += "R";
        } else {
          result += ".";
        }
      }
      result += "\n";
    }
    return result;
  }
}

export class VirtualWheelActuator implements WheelActuator {
  constructor(
    private readonly virtualWarehouse: VirtualWarehouse,
    private readonly axis: "NS" | "EW"
  ) {}

  move(direction: Direction): boolean {
    const positionIndex = this.axis === "NS" ? 1 : 0;
    this.virtualWarehouse.robotPosition[positionIndex] +=
      direction === "Forward" ? 1 : -1;

    return true;
  }
}

export class VirtualPositionSensor implements PositionSensor {
  constructor(private readonly virtualWarehouse: VirtualWarehouse) {}

  getPosition(): [number, number] {
    return this.virtualWarehouse.robotPosition;
  }
}

export class VirtualWallSensor implements WallSensor {
  constructor(private readonly virtualWarehouse: VirtualWarehouse) {}

  detectWalls(): {
    north: boolean;
    south: boolean;
    east: boolean;
    west: boolean;
  } {
    const [x, y] = this.virtualWarehouse.robotPosition;
    return {
      north: y === this.virtualWarehouse.height - 1,
      south: y === 0,
      east: x === this.virtualWarehouse.width - 1,
      west: x === 0,
    };
  }
}
