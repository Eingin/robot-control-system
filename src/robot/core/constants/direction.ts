export const directions = ["Forward", "Backward"] as const;
export type Direction = (typeof directions)[number];
export default Direction;
