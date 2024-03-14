export const commands = ["N", "S", "E", "W"] as const;
export type Command = (typeof commands)[number];

export const isCommand = (x: unknown): x is Command => {
  return commands.includes(x as Command);
};

export default Command;
