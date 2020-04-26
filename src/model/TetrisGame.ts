import {Piece, PIECE_I, PIECE_J, PIECE_L, PIECE_O, PIECE_S, PIECE_T, PIECE_Z, PIECES} from "./Piece";
import {BlockColor, Board, board} from "./Board";

export interface TetrisGame {
  moveCurrentPieceDown(): boolean;

  dropCurrentPiece(): void;

  moveCurrentPieceLeft(): boolean;

  moveCurrentPieceRight(): boolean;

  rotateCurrentPiece(): boolean;

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
  let currentPiece: DroppingPiece = nextDroppingPiece();
  let rowsCompleted = 0;

  function nextDroppingPiece() {
    const piece: Piece = nextPiece();
    const color: BlockColor = getPieceColor(piece)!;
    return droppingPiece(gameBoard, piece, color);
  }

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

  return {
    moveCurrentPieceDown: (): boolean => {
      const result: number | undefined = currentPiece.moveDown();
      if (typeof result === 'number') {
        rowsCompleted += result;
        currentPiece = nextDroppingPiece();
        return true;
      }
      return false;
    },
    dropCurrentPiece: (): void => {
      currentPiece.drop();
      currentPiece = nextDroppingPiece();
    },
    moveCurrentPieceLeft: (): boolean => currentPiece.moveLeft(),
    moveCurrentPieceRight: (): boolean => currentPiece.moveRight(),
    rotateCurrentPiece: (): boolean => currentPiece.rotate(),
    getCurrentPiece: (): Piece => currentPiece.piece(),
    getCurrentPieceColor: (): BlockColor => currentPiece.color,
    getCurrentPieceX: (): number => currentPiece.x(),
    getCurrentPieceY: (): number => currentPiece.y(),
    getCurrentPieceDropY: (): number => currentPiece.getDropY(),
    rowsCompleted: (): number => rowsCompleted,
    getBlock: (x: number, y: number): BlockColor | undefined => gameBoard.getBlock(x, y)
  }
}

interface DroppingPiece {
  readonly color: BlockColor;

  piece(): Piece;

  x(): number;

  y(): number;

  moveDown(): number | undefined;

  drop(): number;

  getDropY(): number;

  moveLeft(): boolean;

  moveRight(): boolean;

  rotate(): boolean;
}

function droppingPiece(board: Board, piece: Piece, color: BlockColor): DroppingPiece {
  let x = Math.floor(board.width / 2);
  let y = board.height - piece.maxY - 1;
  let dropYCached: number | undefined = undefined;

  function getDropY(): number {
    return board.getDropY(piece, x, y);
  }

  return {
    color,
    piece: (): Piece => piece,
    x: (): number => x,
    y: (): number => y,
    moveDown: (): number | undefined => {
      if (board.collides(piece, x, y - 1)) {
        return board.dropPiece(piece, color, x, y);
      }
      y--;
      return undefined;
    },
    drop: (): number => {
      return board.dropPiece(piece, color, x, y);
    },
    getDropY: (): number => {
      return dropYCached || (dropYCached = getDropY());
    },
    moveLeft: (): boolean => {
      if (board.collides(piece, x - 1, y)) {
        return false;
      }
      x--;
      dropYCached = undefined;
      return true;
    },
    moveRight: (): boolean => {
      if (board.collides(piece, x + 1, y)) {
        return false;
      }
      x++;
      dropYCached = undefined;
      return true;
    },
    rotate: (): boolean => {
      const rotatedPiece = piece.rotate();
      let rotatedX = x;

      if (rotatedPiece.maxX + x >= board.width) {
        rotatedX = board.width - rotatedPiece.maxX - 1;
      } else if (rotatedPiece.minX + x < 0) {
        rotatedX = -rotatedPiece.minX;
      }

      if (!board.collides(rotatedPiece, rotatedX, y)) {
        piece = rotatedPiece;
        x = rotatedX;
        dropYCached = undefined;
        return true;
      }

      return false;
    }
  }
}


