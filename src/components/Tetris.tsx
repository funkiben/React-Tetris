import * as React from "react";
import {TetrisGame, tetrisGame} from "../model/TetrisGame";
import {Board} from "./Board";
import {setInterval} from "timers";
import {useEffect, useRef, useState} from "react";
import useEventListener from "@use-it/event-listener";

export const Tetris = () => {
  const width: number = 10;
  const height: number = 24;

  const game: TetrisGame = useRef(tetrisGame(width, height)).current;
  const [blockColors, setBlockColors] = useState(getBlockColors());
  const [score, setScore] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      game.moveCurrentPieceDown();
      updateGraphics();
    }, 400);
    return () => clearInterval(interval);
  }, []);

  useEventListener('keydown', onKeyPress);


  function getBlockColor(x: number, y: number): string | undefined {
    if (game.getCurrentPiece().contains(x - game.getCurrentPieceX(), y - game.getCurrentPieceY())) {
      return game.getCurrentPieceColor();
    }
    if (game.getCurrentPiece().contains(x - game.getCurrentPieceX(), y - game.getCurrentPieceDropY())) {
      return '#444444';
    }
    return game.getBlock(x, y);
  }

  function getBlockColors(): Array<Array<string | undefined>> {
    const blockColors = new Array<Array<string | undefined>>(width);
    for (let x = 0; x < width; x++) {
      blockColors[x] = new Array(height);
      for (let y = 0; y < height; y++) {
        blockColors[x][y] = getBlockColor(x, y);
      }
    }
    return blockColors;
  }

  function updateBlockColors(): void {
    setBlockColors(getBlockColors());
  }

  function updateScore(): void {
    setScore(game.rowsCompleted());
  }

  function updateGraphics() {
    updateBlockColors();
    updateScore();
  }

  function onKeyPress(event: React.KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      game.moveCurrentPieceLeft();
    } else if (event.key === 'ArrowRight') {
      game.moveCurrentPieceRight();
    } else if (event.key === 'ArrowDown') {
      game.moveCurrentPieceDown();
    } else if (event.key === ' ') {
      game.dropCurrentPiece();
    } else if (event.key === 'ArrowUp') {
      game.rotateCurrentPiece();
    } else {
      return;
    }
    updateGraphics();
  }

  return (
      <div style={{display: "flex"}}>
        <Board blockColors={blockColors} width={width} height={height}/>
        <p style={{fontSize: "30px", fontFamily: "Arial", margin: "20px"}}>
          Score: {score}
        </p>
      </div>
  );
};