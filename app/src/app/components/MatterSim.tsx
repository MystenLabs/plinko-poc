import React, { useEffect } from 'react';
import Matter, { Engine, Render, Runner, Bodies, Composite, Vector } from 'matter-js';

const MatterSim: React.FC = () => {
  const engine = Engine.create();
  const ballSize = 7;
  const ballElasticity = 0.1;
  const ballSpeed = 3;
  const ballCategory = 0x0001;

  // [0,1,0,1,0,1,0,1,0,1,0,1]

  useEffect(() => {
    console.log('MatterSim component is rendering.');

    const worldWidth = 800;
    const startPins = 3;
    const pinLines = 12;
    const pinSize = 5;
    const pinGap = 40;
    const desiredGapIndex = 2; // Index of the desired gap (0-based)
    const gapWidth = pinGap;
    const desiredBoxX = -250;//(desiredGapIndex + 0.5) * gapWidth; // X-coordinate of the center of the desired box

    const container = document.getElementById('matter-canvas-container');

    const render = Render.create({
      element: container,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        background: 'white',
        showVelocity: true,
        showAngleIndicator: true,
      },
    });

    const pins: Matter.Body[] = [];
    const ball = Bodies.circle(362, 0, ballSize, {
      restitution: ballElasticity,
      friction: 1,
      density: 0.1,
      frictionStatic: 0,
      render: {
        fillStyle: 'blue',
      },
    });
    ball.collisionFilter.category = ballCategory;

    for (let l = 0; l < pinLines; l++) {
      const linePins = startPins + l;
      const lineWidth = linePins * pinGap;
      for (let i = 0; i < linePins; i++) {
        const pinX = worldWidth / 2 - lineWidth / 2 + i * pinGap;
        const pinY = 100 + l * pinGap;
        const pin = Bodies.circle(pinX, pinY, pinSize, {
          isStatic: true,
          collisionFilter: {
            group: -1,
          },
        });
        pins.push(pin);

        if (l === pinLines - 1 && i < linePins - 1) {
          const bucketX = pinX + pinGap / 2;
          const bucketY = pinY + pinGap / 2;
          const bucket = Bodies.rectangle(bucketX, bucketY, pinGap, pinGap, {
            isStatic: true,
          });

          Composite.add(engine.world, bucket);
        }
      }
    }

    // function findDesiredBoxX(boxIndex: number) {


    // };

    console.log(pins.length);
    console.log(pins[88]);
    console.log(desiredBoxX);

    Composite.add(engine.world, pins);
    Composite.add(engine.world, [ball]);

    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        if (pair.bodyA === ball || pair.bodyB === ball) {
          const pin = pair.bodyA === ball ? pair.bodyB : pair.bodyA;
          const pinX = pin.position.x;
          const ballX = ball.position.x;

          // Calculate the direction based on the ball's position relative to the pin
          const direction = ballX > desiredBoxX ? 1 : -1;

          engine.gravity = {x:0.1, y:0.1, scale: 0.001}; // prepei na kano kati me to gravity sto x gia na kano to auto me to desiredPath isos
          // kai meta na to setato sto kanoniko pali gia na min fainetai oti to pirazo?

          // Calculate the forceMagnitude based on your desired speed
          const forceMagnitude = 0.0037 * (desiredBoxX - ballX);

          // Set the velocity to move the ball towards the desired box
          const velocity = Vector.create(direction * forceMagnitude, ball.velocity.y);
          Matter.Body.setVelocity(ball, velocity);
        }
      });
    });

    Render.run(render);

    const runner = Runner.create();
    Runner.run(runner, engine);

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
