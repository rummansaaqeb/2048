class Game2048 {
    constructor() {
        this.gameBoard = document.getElementById('game-board');
        this.scoreDisplay = document.getElementById('score');
        this.restartButton = document.getElementById('restart');
        this.gameOverMessage = document.getElementById('game-over');
        this.initGame();
        this.setupEventListeners();
    }

    initGame() {
        this.tiles = Array(16).fill(null);
        this.score = 0;
        this.gameOverMessage.classList.add('hidden');
        this.addRandomTile();
        this.addRandomTile();
        this.renderBoard();
    }

    setupEventListeners() {
        this.restartButton.addEventListener('click', () => this.initGame());
        document.addEventListener('keydown', event => this.handleKeyDown(event));
    }

    handleKeyDown(event) {
        switch (event.key) {
            case 'ArrowUp':
                this.moveTiles('up');
                break;
            case 'ArrowDown':
                this.moveTiles('down');
                break;
            case 'ArrowLeft':
                this.moveTiles('left');
                break;
            case 'ArrowRight':
                this.moveTiles('right');
                break;
        }
    }

    moveTiles(direction) {
        let moved = false;
        const merged = Array(16).fill(false);

        const moveTile = (from, to) => {
            if (this.tiles[to] === null) {
                this.tiles[to] = this.tiles[from];
                this.tiles[from] = null;
                moved = true;
            }
            else if (this.tiles[to] === this.tiles[from] && !merged[to]) {
                this.tiles[to] *= 2;
                this.score += this.tiles[to];
                this.tiles[from] = null;
                merged[to] = true;
                moved = true;
            }
        };

        const traverse = (indices) => {
            indices.forEach(index => {
                if (this.tiles[index] !== null) {
                    let newIndex = index;
                    while (true) {
                        const nextIndex = this.getNextIndex(newIndex, direction);
                        if (nextIndex === null
                            || (this.tiles[nextIndex] !== null
                                && this.tiles[nextIndex] !== this.tiles[newIndex])) break;
                        moveTile(newIndex, nextIndex);
                        newIndex = nextIndex;
                    }
                }
            });
        };

        const order = this.createOrder(direction);
        traverse(order);

        if (moved) {
            this.addRandomTile();
            this.renderBoard();
        }

        if(this.checkGameOver()) {
            this.gameOverMessage.classList.remove('hidden');
        }
    }

    checkGameOver() {
        if (this.tiles.includes(null)) return false;
        
        for(let i = 0; i < 16; i++){
            const tile = this.tiles[i];
            const adjacentIndices = [
                i % 4 !== 3 ? i + 1 : null,
                i + 4 < 16 ? i + 4 : null
            ];

            if(adjacentIndices.some(index => index !== null && this.tiles[index] === tile)) {
                return false;
            }
        }
        return true;
    }

    createOrder(direction) {
        const order = [];
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const index = row * 4 + col;
                if (direction === 'up' || direction === 'down') {
                    order.push(index);
                }
                else {
                    order.unshift(index);
                }
            }
        }
        if (direction === 'up' || direction === 'down') {
            return order;
        }
        else {
            const rotatedOrder = [];
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    rotatedOrder.push(order[j * 4 + i]);
                }
            }
            return rotatedOrder;
        }
    }

    getNextIndex(index, direction) {
        const row = Math.floor(index / 4);
        const col = index % 4;
        switch (direction) {
            case 'up': return row > 0 ? index - 4 : null;
            case 'down': return row < 3 ? index + 4 : null;
            case 'left': return col > 0 ? index - 1 : null;
            case 'right': return col < 3 ? index + 1 : null;
        }
    }

    renderBoard() {
        this.gameBoard.innerHTML = '';
        this.tiles.forEach(tile => {
            const tileElement = document.createElement('div');
            tileElement.classList.add('tile');
            if (tile !== null) {
                tileElement.classList.add(`tile-${tile}`);
                tileElement.textContent = tile;
            }
            this.gameBoard.appendChild(tileElement);
        })
        this.scoreDisplay.textContent = `Score: ${this.score}`
    }

    addRandomTile() {
        const emptyTiles = this.tiles.map((tile, index) => tile === null ? index : null).filter(index => index != null);
        if (emptyTiles.length === 0) return;
        const randomIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        this.tiles[randomIndex] = Math.random() < 0.9 ? 2 : 4;
    }
}

document.addEventListener('DOMContentLoaded', () => new Game2048);