const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

var board_width = canvas.width
var board_height = canvas.height
var grid_size = 35
var grid_spacing = 1
var tile_width = (board_width - (grid_size + 1) * grid_spacing) / grid_size
var tile_height = (board_height - (grid_size + 1) * grid_spacing) / grid_size

var board = new Int8Array(grid_size * grid_size)

var paused = true

function get_neighbors(index) {
    let neighbors = []
    if (index % grid_size === 0) {
        if (index - grid_size < 0) {
            neighbors.push(index + 1, index + grid_size, index + grid_size + 1)
        } else if (index + grid_size > grid_size * grid_size) {
            neighbors.push(index + 1, index - grid_size, index - grid_size + 1)
        } else {
            neighbors.push(index + 1, index - grid_size, index + grid_size, index - grid_size + 1, index + grid_size + 1)
        }
    } else if ((index + 1) % grid_size === 0) {
        if (index - grid_size < 0) {
            neighbors.push(index - 1, index + grid_size, index + grid_size - 1)
        } else if (index + grid_size > grid_size * grid_size) {
            neighbors.push(index - 1, index - grid_size, index - grid_size - 1)
        } else {
            neighbors.push(index - 1, index - grid_size, index + grid_size, index - grid_size - 1, index + grid_size - 1)
        }
    } else {
        if (index - grid_size < 0) {
            neighbors.push(index - 1, index + 1, index + grid_size, index + grid_size + 1, index + grid_size - 1)
        } else if (index + grid_size > grid_size * grid_size) {
            neighbors.push(index - 1, index + 1, index - grid_size, index - grid_size + 1, index - grid_size - 1)
        } else {
            neighbors.push(index - 1, index + 1, index - grid_size, index + grid_size, index + grid_size + 1, index + grid_size - 1, index - grid_size + 1, index - grid_size - 1)
        }
    }

    return neighbors
}

function update() {
    //0: Dead
    //1: Alive
    //2: Dead -> Alive
    //3: Alive -> Dead
    for (let i = 0; i < board.length; i++) {
        let alive_near = get_neighbors(i).filter(n => (board[n] === 1) || (board[n] === 3)).length;

        if (alive_near === 2) {
            if (board[i] === 1) {
                board[i] = 1
            }
        } else if (alive_near === 3) {
            if (board[i] === 0) {
                board[i] = 2
            }
        } else {
            if (board[i] === 1) {
                board[i] = 3
            }
        }
    }

    for (let i = 0; i < board.length; i++) {
        if (board[i] === 2) {
            board[i] = 1
        } else if (board[i] === 3) {
            board[i] = 0
        }
    }

}

function draw() {
    ctx.fillStyle = 'grey'
    ctx.fillRect(0, 0, board_width, board_height)

    for (let j = 0; j < grid_size; j++) {
        for (let i = 0; i < grid_size; i++) {

            if (board[grid_size * j + i] === 0){
                ctx.fillStyle = 'lightgrey';
            } else {
                ctx.fillStyle = 'black';
            }

            ctx.fillRect(i * (tile_width + grid_spacing) + grid_spacing, j * (tile_width + grid_spacing) + grid_spacing, tile_width, tile_height)
        }
    }

    //Red green circle
    if (paused === true) {
        ctx.beginPath();
        ctx.arc(canvas.width - 20, 20, 10, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
    } else {
        ctx.beginPath();
        ctx.arc(canvas.width - 20, 20, 10, 0, 2 * Math.PI);
        ctx.fillStyle = "green";
        ctx.fill();
    }
}

function getCellFromCoords(x, y) {
    let col_index = Math.floor(x / (grid_spacing + tile_width))
    let row_index = Math.floor(y / (grid_spacing + tile_height))

    return row_index * grid_size + col_index
}

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    console.log("x: " + x + " y: " + y)

    let i = getCellFromCoords(x, y)
    if (board[i] === 0) {
        board[i] = 1
    } else {
        board[i] = 0
    }
    draw()
}

function keyDownHandler(e) {
    if(e.key == " ") {
        paused = !paused;
        console.log("Toggling pause");
    } else if (e.key == "r") {
        board = board.map(i => 0);
        draw();
    }
}

function main() {
    if (paused === false) {
        update()
    }
    draw()
}

// Keydown callbacks
canvas.addEventListener('mousedown', function(e) {
    getCursorPosition(canvas, e)
})
document.addEventListener("keydown", keyDownHandler, false);

draw()
window.setInterval(main, 250)
