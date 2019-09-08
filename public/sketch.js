let w
let h

const cols = 25
const rows = 25
let grid = new Array(cols)
let openList = []
let closedList = []
let start
let end
let current
let startDraw = false

document.getElementById('start-button').addEventListener('click', function() {
	startDraw = true
})

Array.prototype.remove = function(val) {
	for (let i = this.length - 1; i >= 0; i--) {
		if (this[i] == val) {
			this.splice(i, 1)
		}
	}
}

function Spot(i, j) {
	this.i = i
	this.j = j
	this.neighbors = []
	this.previous = undefined
	this.f = 0
	this.g = 0
	this.h = 0
	this.start = false
	this.end = false
	this.isWall = false


	if (Math.random() * 10 > 11) {
		if ((!this.start) && (!this.end)) {
			this.isWall = true
		}
	}
}

function setWall(i, j, grid) {
	const x = Math.ceil(i / w)
	const y = Math.ceil(j / h)
	if ((x <= cols) && (y <= rows) && grid[x - 1][y - 1]) {
		if (!grid[x - 1][y - 1].isWall) {
			grid[x - 1][y - 1].isWall = true
		}
	}
	// for (let i = 0; i < grid.length; i++) {
	// 	for (let j = 0; j < grid[i].length; j++) {
	// 		const { x, y } = grid[i][j]
	// 		console.log(x)
	// 		if ((x <= i && i <= (x + w)) && (y <= j && j <= (y + h))) {
	// 			grid[i][j].isWall = true
	// 		}
	// 	}
	// }
}

Spot.prototype.setStart = function () {
	this.start = true
}

Spot.prototype.setEnd = function() {
	this.end = true
}

// function star(x, y, radius1, radius2, npoints) {
//   let angle = TWO_PI / npoints;
//   let halfAngle = angle / 2.0;
//   beginShape();
//   for (let a = 0; a < TWO_PI; a += angle) {
//     let sx = x + cos(a) * radius2;
//     let sy = y + sin(a) * radius2;
//     vertex(sx, sy);
//     sx = x + cos(a + halfAngle) * radius1;
//     sy = y + sin(a + halfAngle) * radius1;
//     vertex(sx, sy);
//   }
//   endShape(CLOSE);
// }

Spot.prototype.show = function (color) {
	const { i, j, start, end, isWall } = this
	if (start) {
		fill(255,128,0)
	} else if (end) {
		fill(0, 0, 0)
	} else if (isWall){
		fill(211, 211, 211)
	} else {
		fill(color)
	}
	rect(i * w, j * h, w, h)
}

Spot.prototype.calculateHeuristic = function (end) {
	const { i, j } = this
	const distance = dist(i, j, end.i, end.j)
	this.h = distance
}

function getHeuristic(curr, end) {
	const { i, j } = curr
	const d = dist(i, j, end.i, end.j)
	return d
}

Spot.prototype.addNeighbor = function(grid) {
	const { neighbors, i, j } = this
	if (i < cols - 1) {
		neighbors.push(grid[i + 1][j])
	}

	if (i > 0) {
		neighbors.push(grid[i - 1][j])
	}

	if (j < rows - 1) {
		neighbors.push(grid[i][j + 1])
	}

	if (j > 0) {
		neighbors.push(grid[i][j - 1])
	}

	if (i > 0 && j > 0) {
		neighbors.push(grid[i - 1][j - 1])
	}

	if ((i < cols - 1) && (j > 0)) {
		neighbors.push(grid[i + 1][j - 1])
	}

	if ((i > 0) && (j < rows - 1)) {
		neighbors.push(grid[i - 1][j + 1])
	}

	if ((i < cols - 1) && (j < rows - 1)) {
		neighbors.push(grid[i + 1][j + 1])
	}
}

function showOpenlist() {
	for (let i = 0; i < openList.length; i++) {
		openList[i].show(color(0, 255, 0))
	}
}

function showClosedList() {
	for (let i = 0; i < closedList.length; i++) {
		closedList[i].show(color(255, 0, 0))
	}
}

function setup() {
	let canvas = createCanvas(window.screen.width, window.screen.height-100)
	canvas.parent('canvas-container')

	w = width / cols
	h = height / rows

	for (let i = 0; i < grid.length; i++) {
		grid[i] = new Array(rows)
	}

	for (let i = 0; i < grid.length; i++) {
		for (let j=0; j < grid[i].length; j++) {
			grid[i][j] = new Spot(i, j)
		}
	}

	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j].addNeighbor(grid)
		}
	}

	// start = grid[0][0]
	start = grid[cols-5][rows-4]
	start.setStart()
	// end = grid[cols - 1][rows - 1]
	end = grid[Math.round((Math.random() * (cols)))][Math.round(Math.random() * (rows))]
	end.setEnd()
	openList.push(start)
}



function draw() {

	if (mouseIsPressed === true) {
		setWall(mouseX, mouseY, grid)
		// console.log(`${mouseY} ${mouseX}`)
    // line(mouseX, mouseY, pmouseX, pmouseY);
  }

	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j].show(color(255))
		}
	}

	if (startDraw) {
		if (openList.length > 0) {
			//do something
			let lowestIndex = 0
			for (let i = 0; i < openList.length; i++) {
				if (openList[i].f < openList[lowestIndex].f) {
					lowestIndex = i
				}
			}

			current = openList[lowestIndex]

			if (current == end) {
				noLoop()
				console.log('Done!')
			}

			openList.remove(current)
			closedList.push(current)

		
			let currentNeighbors = current.neighbors
			for (let i = 0; i < currentNeighbors.length; i++) {
				let neighbor = currentNeighbors[i]

				if ((!closedList.includes(neighbor)) && (!neighbor.isWall)) {
					let tempG = current.g + getHeuristic(neighbor, current)

					let newPath = false
					if (openList.includes(neighbor)) {
						if (tempG < neighbor.g) {
							neighbor.g = tempG
							newPath = true
						}
					} else {
						neighbor.g = tempG
						newPath = true
						openList.push(neighbor)
					}

					if (newPath) {
						neighbor.calculateHeuristic(end)
						neighbor.f = neighbor.g + neighbor.h
						neighbor.previous = current
					}
				}
			}
		} else {
			//done
			console.log('No Solution')
			alert('No Solution, Sorry')
			startDraw = false
			noLoop()
			return
		}


		showOpenlist()
		showClosedList()
		//show path
		let path = []
		let temp = current
		path.push(temp)
		while (temp.previous) {
			path.push(temp.previous)
			temp = temp.previous
		}

		beginShape()
		for (let i = 0; i < path.length; i++) {
			path[i].show(color(0, 0, 255))
		}
		endShape()
	}

}
