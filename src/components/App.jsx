import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import "./Header.css"
import "./App.css";

const initialGrid = [
    [3, 0, 6, 5, 0, 8, 4, 0, 0,],
    [5, 2, 0, 0, 0, 0, 0, 0, 0,],
    [0, 8, 7, 0, 0, 0, 0, 3, 1,],
    [0, 0, 3, 0, 1, 0, 0, 8, 0,],
    [9, 0, 0, 8, 6, 3, 0, 0, 5,],
    [0, 5, 0, 0, 9, 0, 6, 0, 0,],
    [1, 3, 0, 0, 0, 0, 2, 5, 0,],
    [0, 0, 0, 0, 0, 0, 0, 7, 4,],
    [0, 0, 5, 2, 0, 6, 3, 0, 0,]]

const gameGrid = initialGrid.map(row => [...row.map(cell => cell)]);


function App() {
    const [board, setBoard] = useState(gameGrid);
    const [, setTick] = useState(0);
    const [isSolving, setIsSolving] = useState(false);
    const delay = 10;

    useEffect(() => {
        const interval = setInterval(() => {
            setTick(tick => tick + 1);
        }, delay);

        // solvedBoard = solver(board, 0);
        setBoard(gameGrid);

        return () => clearInterval(interval);

    }, []);

    const isSafe = (grid, row, column, number) => {

        for (let i = 0; i < 9; i++) {
            if (grid[row][i] === number || grid[i][column] === number) {
                return false;
            }
        }

        let startingRow = Math.floor(row / 3) * 3;
        let startingColumn = Math.floor(column / 3) * 3;

        for (let i = startingRow; i < startingRow + 3; i++) {
            for (let j = startingColumn; j < startingColumn + 3; j++) {
                if (grid[i][j] === number) {
                    return false;
                }
            }
        }
        

        return true;
    }

    const helper = async (grid, row, column, delay) => {
        if (row === 9) {
            return true;
        }

        let newRow = 0;
        let newColumn = 0;
        if (column !== 8) {
            newRow = row;
            newColumn = column + 1;
        } else {
            newRow = row + 1;
            newColumn = 0;
        }

        if (grid[row][column] !== 0) {
            return await helper(grid, newRow, newColumn, delay);
        } else {
            for (let i = 1; i <= 9; i++) {
                if (isSafe(grid, row, column, i)) {
                    grid[row][column] = i;
                    await delayPromise(delay);
                    if (await helper(grid, newRow, newColumn, delay)) {
                        setBoard(grid);
                        return true;
                    } else {
                        grid[row][column] = 0;
                    }
                }
            }
        }

        return false;
    }

    const solver = (grid, delay) => {
        setIsSolving(true);
        if (helper(grid, 0, 0, delay)) {
            setIsSolving(false);
            return grid;
        } else {
            setIsSolving(false);
            return null; // No solution exists
        }

    }

    const delayPromise = (delay) => {
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    const onSolveClicked = async () => {
        if (isSolving) return;
        solver(board, delay);
    }


    return (
        <div>
            <div>
                <div className='header'>
                    <h1>Sudoku<span> Solver</span></h1>
                    <div className='operation'>
                        <p className='solve' onClick={onSolveClicked}>Solve</p>
                    </div>

                </div>
            </div>
            <div className='grid'>
                <table>
                    <tbody>
                        {Array.from({ length: 9 }, (_, rowIndex) => (
                            <tr key={rowIndex}>
                                {Array.from({ length: 9 }, (_, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={`${(colIndex + 1) % 3 === 0 ? 'thin-border-right' : ''} ${(rowIndex + 1) % 3 === 0 ? 'thin-border-bottom' : ''} ${colIndex === 0 ? 'thick-border-left' : ''} ${rowIndex === 0 ? 'thick-border-top' : ''}`}
                                    >
                                        <div id={`${rowIndex}-${colIndex}`} className={`cell ${initialGrid[rowIndex][colIndex] !== 0 ? "initial" : ""}`}>
                                            {board[rowIndex][colIndex] === 0 ? '' : board[rowIndex][colIndex]}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;