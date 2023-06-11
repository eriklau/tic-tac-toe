const Player = (sign) => {
    this.sign = sign;
  
    const getSign = () => {
      return sign;
    };
  
    return { getSign };
};

const gameBoard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];
  
    const setGrid = (index, sign) => {
        board[index] = sign;
    };
  
    const getGrid = (index) => {
        return board[index];
    };
  
    const restartBoard = () => {
      for (let i = 0; i < board.length; i++) {
        board[i] = "";
      }
    };
  
    return { setGrid, getGrid, restartBoard, board };

})();


// SCREEN CONTROLLER
const screenController = (() => {
    const boardElement = document.querySelectorAll(".board-grid");
    const turnMessage = document.getElementById("player-turn");
    const restartButton = document.getElementById("restart-btn");

    boardElement.forEach((grid) => grid.addEventListener('click', (e) => {
        if (gameBoard.board[e.target.dataset.index] != "" || gameController.isGameOver()) {
            console.log("spot taken or game over")
            return; 
        } else {
            // make board[i] = X or O
            gameController.playTurn(parseInt(e.target.dataset.index));
            // actually display X or O on grid
            updateBoard();
            // then change the turn message to O if X was placed and vice versa
            }
    
        })
    );

    restartButton.addEventListener("click", (e) => {
        // reset gameboard possibly by gameboard.reset(), reset array and display
        gameBoard.restartBoard();
        // reset game controller?
        gameController.restartGame();
        // update the gameboard
        updateBoard();
        // reset the current message to turn: X
        setMessage('Turn: X');
    })

    const updateBoard = () => {
        for (let i = 0; i < boardElement.length; i++) {
            boardElement[i].innerHTML = gameBoard.getGrid(i);
        }
    };

    const setMessage = (message) => {
        turnMessage.innerHTML = message;
    }

    // SET MESSAGE FOR WINNER OR DRAW
    const setWinMessage = (message) => {
        if (message === "Draw") {
            setMessage("Draw");
        } else {
            setMessage(` ${message} wins `);
        }
    
    };

    return { setMessage, setWinMessage };

})();


const gameController = (() => {
    const X = Player("X");
    const O = Player("O");

    let turn = 1
    let gameOver = false;

    const playTurn = (gridIndex) => {
        gameBoard.setGrid(gridIndex, getPlayerSign());
        // if there is a winner, then game is over, set message to either X or O as winner
        if (checkForWinner(gridIndex)) {
            screenController.setWinMessage(getPlayerSign());
            gameOver = true;
            return;
        }
        // else if the variable turn reaches 9, set message to DRAW
        else if (turn == 9) {
            screenController.setWinMessage("Draw");
            return;
        }
        // else iterate the variable turn++, and then set message to the next player's turn
        turn++;
        screenController.setMessage(`Turn: ${getPlayerSign()} `);
    };

    const getPlayerSign = () => {
        if (turn % 2 == 1) {
            return X.getSign();
        } else if (turn % 2 == 0) {
            return O.getSign();
        }
    }


    const checkForWinner = (gridIndex) => {

        const dict = {
            0: [[1, 2], [3, 6], [4, 8]],
            1: [[0, 2], [4, 7]],
            2: [[0, 1], [5, 8], [4, 6]],
            3: [[4, 5], [0, 6]],
            4: [[3, 5], [1, 7], [0, 8], [2, 6]],
            5: [[3, 4], [2, 8]],
            6: [[7, 8], [0, 3], [2, 4]],
            7: [[6, 8], [1, 4]],
            8: [[6, 7], [0, 4]]
        }

        for (let i = 0; i < dict[gridIndex].length; i++) {
            if (
                gameBoard.board[gridIndex] == gameBoard.board[dict[gridIndex][i][0]] &&
			    gameBoard.board[gridIndex] == gameBoard.board[dict[gridIndex][i][1]] &&
			    gameBoard.board[gridIndex] != '' &&
                gameBoard.board[dict[gridIndex][i][0]] == gameBoard.board[dict[gridIndex][i][1]] &&
                gameBoard.board[dict[gridIndex][i][0]] != '' &&
                gameBoard.board[dict[gridIndex][i][1]] != ''
            ) {
                return true;
            }
        }
        return false;
    }
    

    const restartGame = () => {
        gameOver = false;
        turn = 1
    }

    const isGameOver = () => {
        return gameOver;
    }

    return { playTurn, restartGame, isGameOver, turn };
    
})();