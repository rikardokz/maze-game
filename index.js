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
Mouse: to acess the mouse options
*/
// boilerplate code
const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter; // Matter is essencialy the Matter Library
// it will be used more times, and this way it helps just calling the variable
// works like a config for changing the size of the maze above line 59ish
const cellsHorizontal = 14;
const cellsVertical = 10;
const width = window.innerWidth;
const height = window.innerHeight;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;
// creates a new engine
const engine = Engine.create();
// to disable gravity in the y direction
engine.world.gravity.y = 0;
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

// Walls
const walls = [
    // this part of the code is explained in the example below all the code
    Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
    Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),
    Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),
    Bodies.rectangle(width, height / 2, 2, height, { isStatic: true }),
];
// this adds the shape created above to the world created on line 17ish + accepts an array of shapes
World.add(world, walls)

// --------------------> Maze generation <-----------------------

// to randomize choice on line 110ish
const shuffle = (arr) => {
    let counter = arr.length;
    while (counter > 0) {
        const index = Math.floor(Math.random() * counter);
        counter--;

        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }
    return arr;
}

// first makes an array of 3, fills it with null, then for each 
// row, it will add 3 falses like so: false, false, false
const grid = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizontal).fill(false));

const verticals = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizontal - 1).fill(false));

const horizontals = Array(cellsVertical - 1)
    .fill(null)
    .map(() => Array(cellsHorizontal).fill(false));

/* another option for grid, but shittier
for (let i = 0; i < 3; i++) {
    grid.push([]);
    for (let j = 0; j < 3; j++) {
        grid[i].push(false)
    }
}
*/
// to pick a random row or column
const startRow = Math.floor(Math.random() * cellsVertical)
const startColumn = Math.floor(Math.random() * cellsHorizontal)


const stepThroughCell = (row, column) => {
    // if i have visited the cell at [row, column], then return
    if (grid[row][column]) {
        return;
    }
    // Mark this cell as being visited
    grid[row][column] = true;
    // Assemble randomly-ordered list of neighbors
    const neighbors = shuffle([
        [row - 1, column, "up"],
        [row, column + 1, "right"],
        [row + 1, column, "down"],
        [row, column - 1, "left"]
    ]);
    // for each neighbor....
    for (let neighbor of neighbors) {
        const [nextRow, nextColumn, direction] = neighbor;
        // see if that neighbor is out of bounds
        if (nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal) {
            continue;
        }
        // if we have visited thar neighbor(wich is marked as true), continue to next neighbor
        if (grid[nextRow][nextColumn]) {
            continue;
        }
        // Remove a wall from either horizontals or verticals array
        if (direction === "left") {
            verticals[row][column - 1] = true;
        } else if (direction === "right") {
            verticals[row][column] = true;
        } else if (direction === "up") {
            horizontals[row - 1][column] = true;
        } else if (direction === "down") {
            horizontals[row][column] = true;
        }
        // visit that next cell
        stepThroughCell(nextRow, nextColumn);
    }
    
};

// calls the function above with random numbers
stepThroughCell(startRow, startColumn);

// iterate to draw walls
horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if(open) {
            return;
        } 

        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX / 2,
            rowIndex * unitLengthY + unitLengthY,
            unitLengthX,
            10, 
            {
                label: "wall",
                isStatic: true,
                render: {
                    fillStyle: "red",
                }
            }
        );

        World.add(world, wall);
    })
});


verticals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) {
            return;
        }

        const wall = Bodies.rectangle(
           columnIndex * unitLengthX + unitLengthX, 
           rowIndex * unitLengthY + unitLengthY / 2,
           10,
           unitLengthY,
           {    
               label: "wall",
               isStatic: true,
               render: {
                   fillStyle: "red"
               }
           }
        )
        World.add(world, wall)
    })
})


// Goal

const goal = Bodies.rectangle(
    width - unitLengthX / 2,
    height - unitLengthY / 2,
    unitLengthX * 0.7,
    unitLengthY * 0.7, 
    {
        label: "goal",
        isStatic: true,
        render: {
            fillStyle: "green"
        }
    }
);
World.add(world, goal);

// Ball
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(
    unitLengthX / 2,
    unitLengthY / 2,
    ballRadius,
    {
        label: "ball",
        render: {
            fillStyle: "blue"
        }
    }
);

World.add(world, ball);

document.addEventListener("keydown", event => {
    // refers to an option of Body wich handels velocity
    const { x, y } = ball.velocity;
    
    if (event.keyCode === 87) {
        Body.setVelocity(ball, {x, y: y - 5});
    }

    if (event.keyCode === 68) {
        Body.setVelocity(ball, {x: x + 5, y});
    }

    if (event.keyCode === 83) {
        Body.setVelocity(ball, {x, y: y + 5});
    }

    if (event.keyCode === 65) {
        Body.setVelocity(ball, {x: x - 5, y});
    }
});

// Win Condition

Events.on(engine, "collisionStart", event => {
    event.pairs.forEach((collision) => {
        const labels = ["ball", "goal"];

        if(labels.includes(collision.bodyA.label) && 
        labels.includes(collision.bodyB.label)) {
            document.querySelector(".winner").classList.remove("hidden")
            engine.world.gravity.y = 1;
            world.bodies.forEach(body => {
                if(body.label === "wall") {
                    Body.setStatic(body, false);
                }
            })
        }
    });
})