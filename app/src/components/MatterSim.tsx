"use client";
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
  // Define bucket colors
  const bucketColors = [
    "#FF0000", // Red
    "#FF3000", // Reddish-Orange
    "#FF6000", // Orange-Red
    "#FF9000", // Dark Orange
    "#FFC000", // Light Orange
    "#FFD800", // Yellow-Orange
    "#FFFF00", // Yellow (central color)
    "#FFD800", // Yellow-Orange
    "#FFC000", // Light Orange
    "#FF9000", // Dark Orange
    "#FF6000", // Orange-Red
    "#FF3000", // Reddish-Orange
    "#FF0000", // Red
  ];

  const [ballFloors, setBallFloors] = useState<number[]>([0, 0]);
  // Array to store positions for the multiplier text
  const multiplierPositions: any = [];
  // Define the multipliers for each spot
  const multipliers = [
    "9.0x",
    "8.2x",
    "6.5x",
    "3.8x",
    "1.0x",
    "0.6x",
    "0.4x",
    "0.6x",
    "1.0x",
    "3.8x",
    "6.5x",
    "8.2x",
    "9.0x",
  ];
  // State for matrix
  const [dropBallPosision, setDropBallPosision] = useState<number[]>([0, 0]);
  // Create a physics engine
  const engine = Engine.create();
  const predefinedPaths: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Example path for the second ball
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], // Example path for the second ball
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    [1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0],
    [1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  ];

  // Ball properties
  const ballSize = 7;
  const ballElasticity = 0.01; // Reduced ball restitution for less bounce
  const ballFriction = 0.0002; // Reduced ball friction for more speed

  const pinRestitution = 0.8;

  useEffect(() => {
    // Canvas dimensions and pin settings
    const worldWidth = 800;
    const startPins = 3;
    const pinLines = 12;
    const pinSize = 12.82; // Adjusted pin size to accommodate the ball
    const pinGap = 39;

    // Setup the rendering context
    const container = document.getElementById("matter-canvas-container");
    const render = Render.create({
      // @ts-ignore
      element: container,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        background: "#36454F",
        showVelocity: true,
        showAngleIndicator: true,
      },
    });

    // Create pins and buckets
    const pins: Matter.Body[] = [];

    const balls: Matter.Body[] = [];

    const forceTrackers: { x: number; y: number }[] = [];

    for (let i = 0; i < predefinedPaths.length; i++) {
      let dropBallPosision = 0;
      if (predefinedPaths[i][0] === 1) {
        dropBallPosision = worldWidth / 2.095 + 17;
      } else {
        dropBallPosision = worldWidth / 2.095 - 20;
      }
      const centerPinX = dropBallPosision;
      //remove the predefinedPaths[i][0]
      predefinedPaths[i].shift(); // because we drop the ball from the top and takes the first value of the array as a starting point
      const ballStartY = 50; // Starting Y position of the ball
      const ball = Bodies.circle(centerPinX, ballStartY, ballSize, {
        restitution: ballElasticity,
        friction: ballFriction,
        density: 0.4,
        render: {
          fillStyle: "#77DD77",
        },
      });

      // Add balls with a delay of 1000ms
      setTimeout(() => {
        Composite.add(engine.world, [ball]);
      }, 750 * i);

      balls.push(ball);
      forceTrackers.push({ x: 0, y: 0 });
    }

    // Set gravity for the simulation
    engine.gravity = { x: 0, y: 0.06, scale: 0.0018 };

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
        const pin = Bodies.circle(pinX, pinY, pinSize, {
          isStatic: true,
          render: {
            visible: true,
            fillStyle: "#87CEEB",
            // lineWidth: 100,
          },
        });
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
          // Calculate and store the position for the multiplier text
          const textX = bucketX + bucketWidth / 2;
          const textY = bucketY + bucketHeight + 20; // 20 is an offset, adjust as needed
          multiplierPositions.push({
            x: textX,
            y: textY,
            value: multipliers[i],
          });

          // Assign a color to each bucket area from the array
          const bucketColor = bucketColors[i % bucketColors.length];
          // Create the bottom area of the bucket
          const bottomArea = Bodies.rectangle(
            bucketX,
            bucketY + bucketHeight / 2,
            bucketWidth - 10, // slightly less width than the bucket itself
            bucketHeight,
            {
              isStatic: true,
              isSensor: true, // Make it a sensor so it doesn't physically interact
              render: {
                fillStyle: bucketColor,
              },
            }
          );

          // Add bucket parts to the world
          Composite.add(engine.world, [leftSide, rightSide, bottomArea]);
        }
      }
    }

    Composite.add(engine.world, pins);

    // Path following logic
    let followingPredefinedPath = Array(predefinedPaths.length).fill(false);
    let currentSteps = Array(predefinedPaths.length).fill(0);

    // Event: Start following the path on the first collision
    Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        for (let i = 0; i < predefinedPaths.length; i++) {
          if (
            (pair.bodyA === balls[i] || pair.bodyB === balls[i]) &&
            !followingPredefinedPath[i]
          ) {
            followingPredefinedPath[i] = true;
            currentSteps[i] = 0;
          }
        }

        // Check if the collision involves a ball and a pin
        let ball = null;
        let pin: Matter.Body | null = null;

        if (balls.includes(pair.bodyA)) {
          ball = pair.bodyA;
          pin = pair.bodyB;
        } else if (balls.includes(pair.bodyB)) {
          ball = pair.bodyB;
          pin = pair.bodyA;
        }

        if (ball && pin) {
          // Calculate the approximate collision point
          const collisionPointY = (ball.position.y + pin.position.y) / 2;

          // Define the top region of the pin (adjust as needed)
          const topOfPin = pin.position.y - pin.circleRadius! / 2;

          // Check if the collision is near the top of the pin and if the pin is not a sensor
          if (collisionPointY <= topOfPin && !pin.isSensor) {
            // Change pin color to red
            pin.render.fillStyle = "#6CA4Bf";

            // Reset pin color after 1 second
            setTimeout(() => {
              if (pin && !pin.isSensor) {
                // Check again to ensure it's not a sensor
                pin.render.fillStyle = "#87CEEB"; // Original color
              }
            }, 100);
          }
        }
        // Check if the collision involves a ball and a bottomArea
        balls.forEach((ball) => {
          if (
            (pair.bodyA === ball && pair.bodyB.isSensor) ||
            (pair.bodyB === ball && pair.bodyA.isSensor)
          ) {
            // Identify the bottomArea in the collision
            const bottomArea = pair.bodyA.isSensor ? pair.bodyA : pair.bodyB;

            // Temporarily increase the size of the bottomArea
            Body.scale(bottomArea, 1.1, 1.1); // Increase by 10%

            // Restore the original size after 1 second
            setTimeout(() => {
              Body.scale(bottomArea, 1 / 1.1, 1 / 1.1); // Scale back to original size
            }, 625);
          }
        });
      });
    });

    // Track the current row and last row's Y position
    let currentRows = Array(predefinedPaths.length).fill(0);
    let lastRowYPositions = Array(predefinedPaths.length).fill(100);

    // Event: Apply force based on the predefined path
    Events.on(engine, "beforeUpdate", () => {
      for (let i = 0; i < predefinedPaths.length; i++) {
        if (
          followingPredefinedPath[i] &&
          currentRows[i] < predefinedPaths[i].length
        ) {
          const newRow = Math.floor((balls[i].position.y - 100) / pinGap);

          if (newRow > currentRows[i]) {
            currentRows[i] = newRow;
            lastRowYPositions[i] = 100 + currentRows[i] * pinGap;
          }

          const distanceFromLastRow =
            balls[i].position.y - lastRowYPositions[i];
          const normalizedDistance = Math.min(
            distanceFromLastRow / (pinGap / 2),
            1
          );

          // Quadratic decrease in force magnitude
          const baseForceMagnitude = 0.006;
          const forceMagnitude =
            baseForceMagnitude * (1 - normalizedDistance ** 2);

          // Adjust the angle of the force
          const angle = (Math.PI / 2) * normalizedDistance - 0.4; // From 0 (horizontal) to PI/2 (vertical)
          const direction = predefinedPaths[i][currentRows[i]] === 0 ? -1 : 1;
          const forceX = Math.cos(angle - 6) * direction * forceMagnitude * 2.3;

          const forceY = Math.sin(angle + 1) * forceMagnitude * 1.2;

          const force = Vector.create(forceX, forceY);
          Body.applyForce(balls[i], balls[i].position, force);
          forceTrackers[i] = force;
        }
      }
    });

    Events.on(engine, "collisionEnd", (event) => {
      event.pairs.forEach((pair) => {
        for (let i = 0; i < predefinedPaths.length; i++) {
          if (pair.bodyA === balls[i] || pair.bodyB === balls[i]) {
            if (currentSteps[i] < predefinedPaths[i].length - 1) {
              currentSteps[i]++; // Move to the next step in the path after each collision
            }
          }
        }
      });
    });

    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: worldWidth, y: 600 },
    });

    Events.on(render, "afterRender", () => {
      // Draw the force vectors
      const context = render.context;
      context.font = "16px Arial"; // Adjust the font size and style as needed
      context.fillStyle = "green"; // Set the text color

      multiplierPositions.forEach((pos: any) => {
        context.fillText(pos.value, pos.x - 35, pos.y - 50);
      });
      for (let i = 0; i < predefinedPaths.length; i++) {
        const startPoint = balls[i].position;
        const endPoint = {
          x: startPoint.x + forceTrackers[i].x * 5000, // Scale factor for visualization
          y: startPoint.y + forceTrackers[i].y * 5000, // Scale factor for visualization
        };

        // context.beginPath();
        // context.moveTo(startPoint.x, startPoint.y);
        // context.lineTo(endPoint.x, endPoint.y);
        // context.strokeStyle = "#ff0000";
        // context.lineWidth = 2;
        // context.stroke();
      }
    });

    // // Start the engine
    const runner = Runner.create();
    engine.timing.timeScale = 2;
    render.options.wireframes = false;
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
