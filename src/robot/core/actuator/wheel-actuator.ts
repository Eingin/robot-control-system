import { Direction } from "../constants/direction";

export default interface WheelActuator {
  move(direction: Direction): boolean;
}
