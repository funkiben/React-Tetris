import {Piece, PIECE_I, PIECE_J, PIECE_L, PIECE_O, PIECE_S, PIECE_T, PIECE_Z, PIECES} from "./Piece";
import {BlockColor, Board, board} from "./Board";

export interface TetrisGame {
  moveCurrentPieceDown(): boolean;

  moveCurrentPieceLeft(): boolean;

  moveCurrentPieceRight(): boolean;

  rotateCurrentPiece(): void;

  getCurrentPiece(): Piece;

  getCurrentPieceColor(): BlockColor;

  getCurrentPieceX(): number;

  getCurrentPieceY(): number;

  getCurrentPieceDropY(): number;

  rowsCompleted(): number;

  getBlock(x: number, y: number): BlockColor | undefined;
}

export function tetrisGame(width: number, height: number): TetrisGame {
  const gameBoard: Board = board(width, height);
  let dropping: DroppingPiece = nextDroppingPiece();
  let rowsCompleted = 0;

  function nextDroppingPiece(): DroppingPiece {
    return droppingPiece(width, height);
  }

  return {
    moveCurrentPieceDown: (): boolean => {
      if (gameBoard.collides(dropping.piece(), dropping.x(), dropping.y() - 1)) {
        rowsCompleted += gameBoard.dropPiece(dropping.piece(), dropping.color, dropping.x(), dropping.y());
        dropping = nextDroppingPiece();
        return true;
      }
      dropping.moveDown();
      return false;
    },
    moveCurrentPieceLeft: (): boolean => {
      if (gameBoard.collides(dropping.piece(), dropping.x() - 1, dropping.y())) {
        return false;
      }
      dropping.moveLeft();
      return true;
    },
    moveCurrentPieceRight: (): boolean => {
      if (gameBoard.collides(dropping.piece(), dropping.x() + 1, dropping.y())) {
        return false;
      }
      dropping.moveRight();
      return true;
    },
    rotateCurrentPiece: (): void => {
      dropping.rotate();
    },
    getCurrentPiece: (): Piece => dropping.piece(),
    getCurrentPieceColor: (): BlockColor => dropping.color,
    getCurrentPieceX: (): number => dropping.x(),
    getCurrentPieceY: (): number => dropping.y(),
    getCurrentPieceDropY: (): number => gameBoard.getDropY(dropping.piece(), dropping.x(), dropping.y()),
    rowsCompleted: (): number => rowsCompleted,
    getBlock: (x: number, y: number): BlockColor | undefined => gameBoard.getBlock(x, y)
  }
}

interface DroppingPiece {
  readonly color: BlockColor;

  piece(): Piece;

  x(): number;

  y(): number;

  moveDown(): void;

  moveLeft(): void;

  moveRight(): void;

  rotate(): void;
}

function droppingPiece(boardWidth: number, boardHeight: number): DroppingPiece {
  function nextPiece(): Piece {
    return PIECES[Math.floor(Math.random() * PIECES.length)];
  }

  function getPieceColor(piece: Piece): BlockColor | undefined {
    if (piece.equals(PIECE_Z)) {
      return 'red';
    } else if (piece.equals(PIECE_T)) {
      return 'purple';
    } else if (piece.equals(PIECE_S)) {
      return 'green';
    } else if (piece.equals(PIECE_O)) {
      return 'yellow';
    } else if (piece.equals(PIECE_I)) {
      return 'aqua';
    } else if (piece.equals(PIECE_L)) {
      return 'orange';
    } else if (piece.equals(PIECE_J)) {
      return 'blue'
    }
  }

  let piece: Piece = nextPiece();

  let x = Math.floor(boardWidth / 2);
  let y = boardHeight - piece.maxY - 1;

  return {
    piece: (): Piece => piece,
    x: (): number => x,
    y: (): number => y,
    color: getPieceColor(piece)!,
    moveDown: (): void => {
      y--;
    },
    moveRight: (): void => {
      x++;
    },
    moveLeft: (): void => {
      x--;
    },
    rotate: (): void => {
      piece = piece.rotate();
    }
  }
}

