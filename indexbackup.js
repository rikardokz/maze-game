/* Matter.js Terminology:
World: Object containing different "things" in our matter app
Engine: Reads the current state of the world from the world object, then
        calculates changes in positions of all the different shapes.
Runner: Gets the engine and world to work together. Runs about 60 times ps.
Render: Whenever the engine processes an update, Render will take a look at all
        the different shapes and show them on the screen.
Body: A shape that we are displaying. Can be a circle, rectangle, oval, etc.
Bodies: Colection of body objects, and gives us the ability of make circle, retangles, etc.
MouseConstraint: To set up a Mouse constraint
Mouse: the name says it all
*/
// boilerplate code
const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } = Matter; // Matter is essencialy the Matter Library

const width = 800;
const height = 600;
// creates a new engine
const engine = Engine.create();
// acess the world created by the new engine above, since creating an engine, gets you a new world
const { world } = engine;
// This creates a new rendered world
// we tell it where we want to show the representation of everything, inside our HTML doc.
const render = Render.create({
 // in other words we tell it to render our representation inside of document.body   
 // it does not destroy content already in the body. It adds.
    element: document.body,
 // specify what engine to use:
    engine: engine,
 // here we specify our canvas element height and width to display the canvas element used to display this
    options: {
        // to make the peices Non blank - Gives solid shapes
        wireframes: false,
        width, //px values
        height//px values
    }
});

// we pass the render that we created on line 20ish
Render.run(render);
// we create a new runner for the engine on line 15ish
Runner.run(Runner.create(), engine);

// --- boiler plate code endes here ---

World.add(world, MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas)
}))

// Walls
const walls = [
    // this part of the code is explained in the example below all the code
    Bodies.rectangle(400, 0, 800, 40, {isStatic: true}),
    Bodies.rectangle(0, 300, 40, 600, {isStatic: true}),
    Bodies.rectangle(400, 600, 800, 40, {isStatic: true}),
    Bodies.rectangle(800, 300, 40, 600, {isStatic: true}),
];
// this adds the shape created above to the world created on line 17ish + accepts an array of shapes
World.add(world, walls)


// Random Shapes:

for (let i = 0; i < 50; i++) {
    if(Math.random() > 0.5) {
    World.add(
        world, 
        Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50, {isStatic: false}),
        );
    } else {
        World.add(
            world,
            Bodies.circle(Math.random() * width, Math.random() * height, 35, {
                render: {
                   // fillStyle: "red" - if you want to add color option
                }
            })
        )
    }
}









/*
// HOW TO CREATE A SIMPLE RECTANGLE
// to add a simple shape to the world by passing the dimentions:
// first two numbers represent the position in world we want the rectangle at (x to side,y to top)
// the last numbers is how wide and how tall
const shape = Bodies.rectangle(200,200,50,50, {
    isStatic: true
});
// this adds the shape created above to the world created on line 17ish
World.add(world, shape);
*/