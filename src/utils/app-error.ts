const ERROR = Symbol("ERROR");

export type AppError<ErrorType> = {
  [ERROR]: true;
  message?: string;
  type?: ErrorType;
};

export function isAppError<ErrorType>(x: unknown): x is AppError<ErrorType> {
  return typeof x === "object" && x != null && ERROR in x;
}

export function CreateAppError<ErrorType>(
  message: string,
  type?: ErrorType
): AppError<ErrorType> {
  return { [ERROR]: true, message, type: type };
}
