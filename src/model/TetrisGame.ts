import {Piece, PIECE_I, PIECE_J, PIECE_L, PIECE_O, PIECE_S, PIECE_T, PIECE_Z, PIECES} from "./Piece";
import {BlockColor, Board, board} from "./Board";

/**
 * A Tetris game.
 */
export interface TetrisGame {
  /**
   * Moves the current piece down by 1 block. Returns true if the piece collided with the ground or blocks.
   */
  moveCurrentPieceDown(): boolean;

  /**
   * Drops the current piece until it hits something.
   */
  dropCurrentPiece(): void;

  /**
   * Moves the current piece left. Returns false if the piece could not be moved left because of a collision.
   */
  moveCurrentPieceLeft(): boolean;

  /**
   * Moves the current piece right. Returns false if the piece could not be moved right because of a collision.
   */
  moveCurrentPieceRight(): boolean;

  /**
   * Rotates the current piece. Returns false if the piece could not be rotated if it results in a collision.
   */
  rotateCurrentPiece(): boolean;

  /**
   * Gets the current piece.
   */
  getCurrentPiece(): Piece;

  /**
   * Gets the color of the current piece.
   */
  getCurrentPieceColor(): BlockColor;

  /**
   * Gets the x coordinate of the current piece.
   */
  getCurrentPieceX(): number;

  /**
   * Gets the y coordinate of the current piece.
   */
  getCurrentPieceY(): number;

  /**
   * Gets the y coordinate of the current piece if it were to be dropped.
   */
  getCurrentPieceDropY(): number;

  /**
   * Gets the number of rows completed so far.
   */
  rowsCompleted(): number;

  /**
   * Gets the block at the given x and y coordinates, or undefined if there is no block.
   * @param x The x coordinate.
   * @param y The y coordinate.
   */
  getBlock(x: number, y: number): BlockColor | undefined;

  /**
   * Checks if the game has been lost.
   */
  hasLost(): boolean;
}

/**
 * Creates a new tetris game with the given width and height.
 * @param width
 * @param height
 */
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
    getBlock: (x: number, y: number): BlockColor | undefined => gameBoard.getBlock(x, y),
    hasLost: () => gameBoard.collides(currentPiece.piece(), currentPiece.x(), currentPiece.y())
  }
}

/**
 * A piece that is currently being dropped and controlled by the user.
 */
interface DroppingPiece {
  /**
   * The color of the piece.
   */
  readonly color: BlockColor;

  /**
   * The piece.
   */
  piece(): Piece;

  /**
   * The x coordinate of the piece.
   */
  x(): number;

  /**
   * The y coordinate of the piece.
   */
  y(): number;

  /**
   * Moves the piece down by one. Returns the number of rows completed if the piece was dropped, or undefined.
   */
  moveDown(): number | undefined;

  /**
   * Drops the piece, returns the number of rows completed.
   */
  drop(): number;

  /**
   * Gets the y coordinate of the piece if it were to be dropped.
   */
  getDropY(): number;

  /**
   * Moves the piece left by one. Returns false if the piece could not be moved left.
   */
  moveLeft(): boolean;

  /**
   * Moves the piece right by one. Returns false if the piece could not be moved right.
   */
  moveRight(): boolean;

  /**
   * Rotates the piece. Returns false if the piece could not be rotated.
   */
  rotate(): boolean;
}

/**
 * Creates a new dropping piece that's controlled by the player. The piece starts at the top of the board.
 * @param board The board the piece is being dropped on.
 * @param piece The piece.
 * @param color The color of the piece.
 */
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


