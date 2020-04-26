import {Piece} from "./Piece";

export interface Board {
  readonly width: number;
  readonly height: number;

  collides(piece: Piece, pieceX: number, pieceY: number): boolean;

  dropPiece(piece: Piece, color: BlockColor, pieceX: number, pieceY: number): number;

  getDropY(piece: Piece, pieceX: number, pieceY: number): number;

  getBlock(x: number, y: number): BlockColor | undefined;
}

export type BlockColor = 'red' | 'yellow' | 'aqua' | 'blue' | 'green' | 'orange' | 'purple';

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

interface BlockColumn {
  setBlock(y: number, block: BlockColor): void;

  removeBlock(y: number): void;

  getBlockAt(y: number): BlockColor | undefined;

  contains(piece: Piece, columnX: number, pieceX: number, pieceY: number): boolean;
}

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