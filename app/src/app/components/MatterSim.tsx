import React, { useEffect } from 'react';
import Matter, { Engine, Render, Runner, Bodies, Composite, Vector, IPair } from 'matter-js';

const MatterSim: React.FC = () => {
  // Create a physics engine instance
  const engine = Engine.create();

  // Ball properties
  const ballSize = 7;
  const ballElasticity = 0.1; // Bounciness of the ball
  const ballSpeed = 4;
  const ballCategory = 0x0001; // Collision category for the ball

  // Vector to control the ball direction after each collision
  const directionVector = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
  let vectorIndex = 0; // Current index in the direction vector

  useEffect(() => {
    console.log('MatterSim component is rendering.');

    // Define the dimensions of the simulation world
    const worldWidth = 800;
    const startPins = 3; // Starting number of pins in the first line
    const pinLines = 12; // Total number of lines of pins
    const pinSize = 5; // Size of each pin
    const pinGap = 40; // Gap between pins

    // Get the DOM element to render the simulation
    const container = document.getElementById('matter-canvas-container');

    // Create a renderer for the physics engine
    const render = Render.create({
      element: container, // DOM element to render within
      engine: engine, // Physics engine to use
      options: {
        width: 800,
        height: 600,
        background: 'white',
        showVelocity: true, // Show velocity vectors in the simulation
        showAngleIndicator: true, // Show angle indicators in the simulation
      },
    });

    // Array to store all pin bodies
    const pins = [];

    // Create a ball body
    const ball = Bodies.circle(362, 0, ballSize, {
      restitution: ballElasticity, // Bounciness
      friction: 1,
      density: 0.1,
      frictionStatic: 0,
      render: {
        fillStyle: 'blue', // Color of the ball
      },
    });
    ball.collisionFilter.category = ballCategory; // Set collision category

    // Loop to create pins in a triangular formation
    for (let l = 0; l < pinLines; l++) {
      const linePins = startPins + l;
      const lineWidth = linePins * pinGap;
      for (let i = 0; i < linePins; i++) {
        const pinX = worldWidth / 2 - lineWidth / 2 + i * pinGap;
        const pinY = 100 + l * pinGap;
        const pin = Bodies.circle(pinX, pinY, pinSize, {
          isStatic: true, // Pins are stationary
          collisionFilter: {
            group: -1, // Negative collision group for intra-pin collisions
          },
        });
        pins.push(pin);

        // Create buckets at the bottom of the pin setup
        if (l === pinLines - 1 && i < linePins - 1) {
          const bucketX = pinX + pinGap / 2;
          const bucketY = pinY + pinGap / 2;
          const bucket = Bodies.rectangle(bucketX, bucketY, pinGap, pinGap, {
            isStatic: true, // Buckets are stationary
          });
          Composite.add(engine.world, bucket);
        }
      }
    }

    // Add all pins to the world
    Composite.add(engine.world, pins);
    // Add the ball to the world
    Composite.add(engine.world, [ball]);

    // Set up a collision event listener
    Matter.Events.on(engine, 'collisionStart', (event: any) => {
       console.log("Collision detected");
      event.pairs.forEach((pair: any) => {
        // Check if the collision involves the ball
        if (pair.bodyA === ball || pair.bodyB === ball) {
          // Determine the direction based on the vector
          const direction = directionVector[vectorIndex] === 1 ? 1 : -1;
          // Update the index for the next collision
          vectorIndex = (vectorIndex + 1) % directionVector.length;
          // Calculate the force magnitude based on the ball speed
          const forceMagnitude = ballSpeed * direction;
          // Create a velocity vector based on the force magnitude
          const velocity = Vector.create(forceMagnitude, ball.velocity.y);
          // Apply the velocity to the ball

          // Matter.Body.setVelocity(ball, velocity);
        
          Matter.Body.setVelocity(ball, { x: 5, y: 0 });

        }
      });
    });

    // Run the renderer
    Render.run(render);
    // Create a runner to run the engine
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Cleanup function to stop the renderer and runner when the component unmounts
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      document.body.removeChild(render.canvas);
    };
  }, []);

  return (
    <div>
      <div id="matter-canvas-container"></div>
    </div>
  );
};

export default MatterSim;