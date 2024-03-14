export type WallDetectionState = {
  north: boolean;
  south: boolean;
  east: boolean;
  west: boolean;
};

export default interface WallSensor {
  detectWalls(): WallDetectionState;
}
