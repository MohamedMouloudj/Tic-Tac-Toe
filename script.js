let onlyOneStartCounter=0;
let scoreX=0;
let scoreO=0;
const start=()=>{

    onlyOneStartCounter++

    if(onlyOneStartCounter>1) {
        onlyOneStartCounter--;
        return;
    }
    
    
    const scoreXElement=document.querySelector(".x--score");
    const scoreOElement=document.querySelector(".o--score");
    let currentPlayer="X";
    let attemptCounter=0;
    let  ROW_NUMBER;
    let tempSize=parseInt(document.querySelector(`input[type="number"]`).value);

    if( Number.isInteger(tempSize)&& tempSize>=3 &&tempSize<=9){
        ROW_NUMBER=tempSize
    }else{
        alert("It must be a number bigger or equal 3 AND under or equal 9!");
        onlyOneStartCounter--
        return;
    }
    const maxAttempts=ROW_NUMBER**2;
    
    const createBoardArray=()=>{
        let board=[];
        for (let row=0;row<ROW_NUMBER;row++){
            board.push(Array.from({length:ROW_NUMBER},()=>"_"))
        }
        return board;
    }
    let board=createBoardArray();

    const getCellCoords=(index)=>{
        const row=Math.floor(index/ROW_NUMBER);
        const column=index%ROW_NUMBER;
        return {row , column};
    }

    const drawMark=(cell)=>{
        cell.querySelector(".value").textContent=currentPlayer;
        cell.classList.add(`cell--${currentPlayer}`);
    }

    const showScore=(scoreX, scoreO)=>{
        scoreXElement.textContent = scoreX;
        scoreOElement.textContent = scoreO;
    }

    const resetSize=()=>{
        document.querySelector(".board") && document.querySelector(".board").remove();
        onlyOneStartCounter=0;
        return;
    }

    const resetBoard=()=>{
        document.querySelector(".board") && document.querySelector(".board").remove();
        board=createBoardArray();
        createBoard()
        currentPlayer="X";
        attemptCounter=0;
    };


    const checkColumn=(currentPlayer)=>{
        let column=0;
        for(let row=0;row<ROW_NUMBER;row++){
            while(column<ROW_NUMBER){
                if(board[row][column]!==currentPlayer){
                    column=0;
                    break;
                }
                column++;
            }
            if(column===ROW_NUMBER){
                return true;
            }
        }
        return false;
    }

    const checkRow=(currentPlayer)=>{
        let row=0;
        for(let column=0;column<ROW_NUMBER;column++){
            while(row<ROW_NUMBER){
                if(board[row][column]!==currentPlayer){
                    row=0;
                    break;
                }
                row++;
            }
            if(row===ROW_NUMBER){
                return true;
            }
        }
        return false;
    }

    const checkDiagonal=(currentPlayer)=>{
        let column=0;
        let row=0;
        while(row<ROW_NUMBER){
            while(column<ROW_NUMBER){
                if(board[row][column] !==currentPlayer){
                    return false;
                }
                column++;
                row++;
            }
        }
        return true;
    }

    const checkSecondDiagonal=(currentPlayer)=>{
        let column=ROW_NUMBER-1;
        let row=0;
        while(row<ROW_NUMBER){
            while(column>=0){
                if(board[row][column] !==currentPlayer){
                    return false;
                }
                column--;
                row++;
            }
        }
        return true;
    }

    const checkWin=(currentPlayer)=>{
        return(
            checkSecondDiagonal(currentPlayer)||
            checkColumn(currentPlayer)||
            checkRow(currentPlayer)||
            checkDiagonal(currentPlayer))
    };

    const runWin=(currentPlayer)=>{
        setTimeout(()=>
        alert(`${currentPlayer} won!`)
        ,100)
        resetBoard()
    };

    const runDraw=()=>{
        setTimeout(()=>
        alert("Draw!")
        ,100)
        resetBoard()
    };

    showScore(scoreX, scoreO);
    const cellClickHandler=(event,index)=>{
        const selectedCell=event.target;
        const {row,column}=getCellCoords(index);
    
        if(board[row][column]==="_"){
            attemptCounter++;
            board[row][column]=currentPlayer;
            drawMark(selectedCell);
        }

        if(checkWin(currentPlayer)){
            setTimeout(()=>runWin(currentPlayer),100);
            (currentPlayer==="X") ? scoreX++ : scoreO++;
            showScore(scoreX, scoreO);
        }else{
            if(attemptCounter===maxAttempts) runDraw();
            
            currentPlayer=(currentPlayer==="X") ? "O" : "X";
        }
    }

    const createBoard=()=>{
        const container=document.querySelector(".container");
        const board=document.createElement("div");
        board.classList.add("board");
        for(let i=0; i<maxAttempts;i++){
            const stringCellElement=`<div class="cell" role="button" tabindex="${i+1}"><span class="value"></span></div>`;
            const cellElement=document.createRange().createContextualFragment(stringCellElement);
            cellElement.querySelector(".cell").onclick = (event) =>cellClickHandler(event,i);
            cellElement.querySelector(".cell").onkeydown = (event) => event.key==="Enter" ? cellClickHandler(event,i) : true;
            board.appendChild(cellElement);
        }
        document.documentElement.style.setProperty("--grid-rows", ROW_NUMBER);
        container.insertAdjacentElement("afterbegin", board)
        
    }
    createBoard()

    const resetButton=document.querySelector("#reset");
    resetButton.addEventListener("click",()=>{
        resetBoard();
        scoreO=0;
        scoreX=0;
        showScore(scoreX, scoreO);
    });

    const resetSizeButton=document.querySelector("#reset--size");
    resetSizeButton.addEventListener("click",resetSize);
}