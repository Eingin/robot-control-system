import prompt from "prompt";

import { Robot } from "./robot";
import {
  VirtualPositionSensor,
  VirtualWallSensor,
  VirtualWarehouse,
  VirtualWheelActuator,
} from "./virtual-warehouse";
import { isAppError } from "./utils/app-error";

async function Testbed() {
  const warehouse = new VirtualWarehouse(10, 10, [0, 0]);
  const northSouthActuator = new VirtualWheelActuator(warehouse, "NS");
  const eastWestActuator = new VirtualWheelActuator(warehouse, "EW");
  const wallSensor = new VirtualWallSensor(warehouse);
  const positionSensor = new VirtualPositionSensor(warehouse);

  const robot = new Robot(
    wallSensor,
    positionSensor,
    northSouthActuator,
    eastWestActuator
  );

  prompt.start({ message: "Enter command" });

  console.log(warehouse.print());

  while (true) {
    const result = await prompt.get(["command"]);

    const command = result.command as string;
    const moveResult = robot.move(command);

    if (isAppError(moveResult)) {
      console.error(moveResult.message);
    } else {
      console.log(`Robot moved to position: ${moveResult}`);
    }

    console.log(warehouse.print());
  }
}

Testbed();
