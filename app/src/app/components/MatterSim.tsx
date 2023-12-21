import React, { useEffect, useState } from "react";
import Matter, {
  Engine,
  Render,
  Runner,
  Bodies,
  Composite,
  Vector,
  Events,
  Body,
} from "matter-js";

const MatterSim: React.FC = () => {
  const [ballFloors, setBallFloors] = useState({ firstBall: 0, secondBall: 0 });
  // Create a physics engine
  const engine = Engine.create();

  // Ball properties
  const ballSize = 7;
  const ballElasticity = 0.1; // Reduced ball restitution for less bounce
  const ballFriction = 0.01;

  useEffect(() => {
    // Canvas dimensions and pin settings
    const worldWidth = 800;
    const startPins = 3;
    const pinLines = 12;
    const pinSize = 12.3; // Adjusted pin size to accommodate the ball
    const pinGap = 39;

    // Flag to indicate if the initial extra force has been applied
    let initialForceApplied = false;

    // Setup the rendering context
    const container = document.getElementById("matter-canvas-container");
    const render = Render.create({
      // @ts-ignore
      element: container,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        background: "red",
        showVelocity: true,
        showAngleIndicator: true,
      },
    });

    // Create pins and buckets
    const pins: Matter.Body[] = [];
    const centerPinX = worldWidth / 2.095;
    const ballStartY = 50; // Starting Y position of the ball
    const ball = Bodies.circle(centerPinX, ballStartY, ballSize, {
      restitution: ballElasticity,
      friction: ballFriction,
      density: 0.4,
      render: { fillStyle: "blue" },
    });

    // Set gravity for the simulation
    engine.gravity = { x: 0, y: 0.06, scale: 0.001 };

    // Store the X positions of the pins
    let pinPositions = [];

    // Create pins and add them to the world
    for (let l = 0; l < pinLines; l++) {
      const linePins = startPins + l;
      const lineWidth = linePins * pinGap;
      pinPositions[l] = [];
      for (let i = 0; i < linePins; i++) {
        const pinX = worldWidth / 2 - lineWidth / 2 + i * pinGap;
        const pinY = 100 + l * pinGap;
        const pin = Bodies.circle(pinX, pinY, pinSize, { isStatic: true });
        pins.push(pin);
        // Create buckets at the bottom
        if (l === pinLines - 1 && i < linePins - 1) {
          const bucketX = pinX + pinGap / 2;
          const bucketY = pinY + pinGap; // Position for the bottom of the bucket
          const bucketWidth = pinGap; // Width of the bucket
          const bucketHeight = 30; // Height of the bucket sides

          // Create left side of the bucket
          const leftSide = Bodies.rectangle(
            bucketX - bucketWidth / 2,
            bucketY + bucketHeight / 2,
            5,
            bucketHeight,
            {
              isStatic: true,
            }
          );

          // Create right side of the bucket
          const rightSide = Bodies.rectangle(
            bucketX + bucketWidth / 2,
            bucketY + bucketHeight / 2,
            5,
            bucketHeight,
            {
              isStatic: true,
            }
          );

          // Create bottom of the bucket
          const bottom = Bodies.rectangle(
            bucketX,
            bucketY + bucketHeight,
            bucketWidth,
            5,
            {
              isStatic: true,
            }
          );

          // Add bucket parts to the world
          Composite.add(engine.world, [leftSide, rightSide, bottom]);
        }
      }
    }

    Composite.add(engine.world, pins);
    Composite.add(engine.world, [ball]);

    ///
    // Additional ball properties
    const secondBall = Bodies.circle(centerPinX, ballStartY, ballSize, {
      restitution: ballElasticity,
      friction: ballFriction,
      density: 0.4,
      render: { fillStyle: "blue" },
    });
    //add second ball with delay
    setTimeout(() => {
      Composite.add(engine.world, [secondBall]);
    }, 5000);

    // Second predefined path
    const secondPredefinedPath = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0]; // Example path for second ball
    ///

    // Path following logic
    let followingPredefinedPath = false;
    let currentStep = 0;
    const predefinedPath = [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0]; // Predefined path for the ball 3

    // Event: Start following the path on the first collision
    Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        if (
          (pair.bodyA === ball || pair.bodyB === ball) &&
          !followingPredefinedPath
        ) {
          followingPredefinedPath = true;
          currentStep = 0;
        }
      });
    });

    // Track the current row and last row's Y position
    let currentRow = 0;
    let currentRow_2 = 0;
    let lastRowYPosition = 100;
    let lastRowYPosition_2 = 100;
    let lastAppliedForce = { x: 0, y: 0 };

    // Event: Apply force based on the predefined path
    Events.on(engine, "beforeUpdate", () => {
      if (followingPredefinedPath && currentRow < predefinedPath.length) {
        const newRow = Math.floor((ball.position.y - 100) / pinGap);

        // Apply an initial extra force when the ball starts moving
        if (!initialForceApplied) {
          console.log("initialForceApplied");
          initialForceApplied = true; // Ensure the force is applied only once
          const initialDirection = predefinedPath[0] === 0 ? -1 : 1;
          //remove the first element from the array
          predefinedPath.shift();
          const initialForceMagnitude = 0.07; // Adjust as needed
          const initialForce = Vector.create(
            initialForceMagnitude * initialDirection,
            0
          );
          Body.applyForce(ball, ball.position, initialForce);
        }

        if (newRow > currentRow) {
          currentRow = newRow;
          lastRowYPosition = 100 + currentRow * pinGap;
          console.log("currentRow", currentRow);
        }

        const distanceFromLastRow = ball.position.y - lastRowYPosition;
        const normalizedDistance = Math.min(
          distanceFromLastRow / (pinGap / 2),
          1
        );

        // Quadratic decrease in force magnitude
        const baseForceMagnitude = 0.003;
        const forceMagnitude =
          baseForceMagnitude * (1 - normalizedDistance ** 2);

        // Adjust the angle of the force
        const angle = (Math.PI / 2) * normalizedDistance; // From 0 (horizontal) to PI/2 (vertical)
        const direction = predefinedPath[currentRow] === 0 ? -1 : 1;
        const forceX = Math.cos(angle) * direction * forceMagnitude;
        const forceY = Math.sin(angle) * forceMagnitude;

        const force = Vector.create(forceX, forceY);
        Body.applyForce(ball, ball.position, force);
        lastAppliedForce = force;
      }

      if (followingPredefinedPath && currentRow_2 < predefinedPath.length) {
        const newRow_2 = Math.floor((secondBall.position.y - 100) / pinGap);

        // Apply an initial extra force when the secondBall starts moving
        if (!initialForceApplied) {
          console.log("initialForceApplied");
          initialForceApplied = true; // Ensure the force is applied only once
          const initialDirection = predefinedPath[0] === 0 ? -1 : 1;
          //remove the first element from the array
          predefinedPath.shift();
          const initialForceMagnitude = 0.07; // Adjust as needed
          const initialForce = Vector.create(
            initialForceMagnitude * initialDirection,
            0
          );
          Body.applyForce(secondBall, secondBall.position, initialForce);
        }

        if (newRow_2 > currentRow_2) {
          currentRow_2 = newRow_2;
          lastRowYPosition_2 = 100 + currentRow_2 * pinGap;
          console.log("currentRow_2", currentRow_2);
        }

        const distanceFromLastRow_2 =
          secondBall.position.y - lastRowYPosition_2;
        const normalizedDistance_2 = Math.min(
          distanceFromLastRow_2 / (pinGap / 2),
          1
        );

        // Quadratic decrease in force magnitude
        const baseForceMagnitude_2 = 0.003;
        const forceMagnitude_2 =
          baseForceMagnitude_2 * (1 - normalizedDistance_2 ** 2);

        // Adjust the angle of the force
        const angle = (Math.PI / 2) * normalizedDistance_2; // From 0 (horizontal) to PI/2 (vertical)
        const direction = predefinedPath[currentRow] === 0 ? -1 : 1;
        const forceX = Math.cos(angle) * direction * forceMagnitude_2;
        const forceY = Math.sin(angle) * forceMagnitude_2;

        const force = Vector.create(forceX, forceY);
        // delay the force
        // setTimeout(() => {
        //   Body.applyForce(secondBall, secondBall.position, force);
        // }, 5000);
        // Body.applyForce(secondBall, secondBall.position, force);
        // lastAppliedForce = force;
      }
    });

    Events.on(engine, "collisionEnd", (event) => {
      event.pairs.forEach((pair) => {
        if (pair.bodyA === ball || pair.bodyB === ball) {
          if (currentStep < predefinedPath.length - 1) {
            currentStep++; // Move to the next step in the path after each collision
          }
        }
      });
    });

    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: worldWidth, y: 600 },
    });

    Events.on(render, "afterRender", () => {
      // ... (existing rendering logic)

      // Draw the force vector
      const context = render.context;
      const startPoint = ball.position;
      const endPoint = {
        x: startPoint.x + lastAppliedForce.x * 5000, // Scale factor for visualization
        y: startPoint.y + lastAppliedForce.y * 5000, // Scale factor for visualization
      };

      context.beginPath();
      context.moveTo(startPoint.x, startPoint.y);
      context.lineTo(endPoint.x, endPoint.y);
      context.strokeStyle = "#ff0000";
      context.lineWidth = 2;
      context.stroke();
    });

    // Start the engine
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    return () => {
      // Clear the runner and stop the render on unmount
      Runner.stop(runner);
      Render.stop(render);
    };
  }, []);

  return (
    <div>
      <div id="matter-canvas-container"></div>
    </div>
  );
};

export default MatterSim;
