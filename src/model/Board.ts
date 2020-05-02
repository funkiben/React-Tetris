import {Piece} from "./Piece";

/**
 * A board in tetris. Stores all blocks from pieces that have been dropped.
 */
export interface Board {
  /**
   * The width of the board.
   */
  readonly width: number;

  /**
   * The height of the board.
   */
  readonly height: number;

  /**
   * Checks if the given piece at the given coordinates collides with either walls or blocks.
   * @param piece The piece to check for collisions.
   * @param pieceX The x coordinate of the piece.
   * @param pieceY The y coordinate of the piece.
   */
  collides(piece: Piece, pieceX: number, pieceY: number): boolean;

  /**
   * Drops the given piece at the given coordinates and color. The piece will become part of the board. Returns the
   * number of rows completed by the newly dropped piece.
   * @param piece The piece to drop.
   * @param color The color of the piece.
   * @param pieceX The x coordinate of the piece.
   * @param pieceY The y coordinate of the piece.
   */
  dropPiece(piece: Piece, color: BlockColor, pieceX: number, pieceY: number): number;

  /**
   * Gets the y coordinate of the given piece if it were to be dropped.
   * @param piece The piece that would be dropped.
   * @param pieceX The starting x coordinate of the piece before being dropped.
   * @param pieceY The starting y coordinate of the piece before being dropped.
   */
  getDropY(piece: Piece, pieceX: number, pieceY: number): number;

  /**
   * Gets the block at the given coordinates, or undefined if there is no block.
   * @param x The x coordinate.
   * @param y The y coordinate.
   */
  getBlock(x: number, y: number): BlockColor | undefined;
}

/**
 * Possible colors of a block.
 */
export type BlockColor = 'red' | 'yellow' | 'aqua' | 'blue' | 'green' | 'orange' | 'purple';

/**
 * Creates a new board with the given width and height.
 * @param width The width of the board.
 * @param height The height of the board.
 */
export function board(width: number, height: number): Board {
  const columns: Array<BlockColumn> = Array.from({length: 10}, () => blockColumn(height));

  function placePiece(piece: Piece, color: BlockColor, pieceX: number, pieceY: number) {
    piece.forEachBlock((x, y) => {
      columns[x + pieceX].setBlock(y + pieceY, color);
    });
  }

  function collidesWithGround(piece: Piece, pieceY: number): boolean {
    return pieceY + piece.minY < 0;
  }

  function collidesWithBlocks(piece: Piece, pieceX: number, pieceY: number): boolean {
    return columns.some((column, columnX) => column.contains(piece, columnX, pieceX, pieceY));
  }

  function collidesWithWalls(piece: Piece, pieceX: number): boolean {
    return piece.minX + pieceX < 0 || piece.maxX + pieceX >= width;
  }

  function isRowComplete(y: number): boolean {
    return columns.every(column => column.getBlockAt(y));
  }

  function removeRow(y: number): void {
    columns.forEach(column => column.removeBlock(y));
  }

  function removeCompletedRows(): number {
    let rowsCompleted = 0;
    for (let y = height - 1; y >= 0; y--) {
      if (isRowComplete(y)) {
        removeRow(y);
        rowsCompleted++;
      }
    }
    return rowsCompleted;
  }

  function getDropY(piece: Piece, pieceX: number, pieceY: number): number {
    if (piece.maxX + pieceX >= width || piece.minX + pieceX < 0 || pieceY + piece.minY < 0) {
      throw new Error("Invalid coordinates for dropped piece");
    }
    for (let y = pieceY; y >= -piece.minY; y--) {
      if (collidesWithBlocks(piece, pieceX, y - 1) || collidesWithGround(piece, y - 1)) {
        return y;
      }
    }
    return -piece.minY;
  }

  return {
    width,
    height,
    collides: (piece: Piece, pieceX: number, pieceY: number): boolean => {
      return collidesWithWalls(piece, pieceX)
          || collidesWithGround(piece, pieceY)
          || collidesWithBlocks(piece, pieceX, pieceY);
    },
    getDropY,
    dropPiece: (piece: Piece, color: BlockColor, pieceX: number, pieceY: number): number => {
      placePiece(piece, color, pieceX, getDropY(piece, pieceX, pieceY));
      return removeCompletedRows();
    },
    getBlock: (x: number, y: number): BlockColor | undefined => {
      return columns[x].getBlockAt(y);
    }
  }
}

/**
 * A column of blocks.
 */
interface BlockColumn {
  /**
   * Sets the block color at the given y in the column.
   * @param y The y of the block to set.
   * @param block The new block color.
   */
  setBlock(y: number, block: BlockColor): void;

  /**
   * Removes the block at the given y coordinate, shifting all blocks above it down by one to fill the empty space.
   * @param y The y of the block to remove.
   */
  removeBlock(y: number): void;

  /**
   * Gets the block at the given y coordinate.
   * @param y The position of the block to retrieve.
   */
  getBlockAt(y: number): BlockColor | undefined;

  /**
   * Checks if any part of the given piece contains a block in the column.
   * @param piece The piece.
   * @param columnX The x coordinate of this column.
   * @param pieceX The x coordinate of the piece.
   * @param pieceY The y coordinate of the piece.
   */
  contains(piece: Piece, columnX: number, pieceX: number, pieceY: number): boolean;
}

/**
 * Creates a new column with the given height.
 * @param height The height of the column.
 */
function blockColumn(height: number): BlockColumn {
  const blocks: Array<BlockColor | undefined> = new Array<BlockColor | undefined>(height);

  function doesPieceContainBlock(piece: Piece, blockX: number, blockY: number, pieceX: number, pieceY: number): boolean {
    return piece.contains(blockX - pieceX, blockY - pieceY);
  }

  return {
    setBlock: (y, block) => {
      blocks[y] = block;
    },
    removeBlock: y => {
      for (; y < height; y++) {
        blocks[y] = blocks[y + 1];
      }
    },
    getBlockAt: (y: number): BlockColor | undefined => {
      return blocks[y];
    },
    contains: (piece: Piece, columnX: number, pieceX: number, pieceY: number): boolean => {
      return blocks.some((block, blockY) => block && doesPieceContainBlock(piece, columnX, blockY, pieceX, pieceY));
    }
  }
}