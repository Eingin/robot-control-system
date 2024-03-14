export const controlErrors = [
  "WallDetected",
  "ActuatorError",
  "InvalidCommand",
] as const;
export type ControlError = (typeof controlErrors)[number];
export default ControlError;
