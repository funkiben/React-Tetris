/**
 * I Tetris piece definition.
 */
export const PIECE_I: Piece = piece(
    coord(-2, 1),
    coord(-1, 1),
    coord(0, 1),
    coord(1, 1),
    coord(-2, 1)
);

/**
 * J Tetris piece definition.
 */
export const PIECE_J: Piece = piece(
    coord(0, 0),
    coord(1, 1),
    coord(1, 0),
    coord(-1, 0)
);

/**
 * L Tetris piece definition.
 */
export const PIECE_L: Piece = piece(
    coord(1, 0),
    coord(0, 0),
    coord(-1, 0),
    coord(-1, -1)
);

/**
 * O Tetris piece definition.
 */
export const PIECE_O: Piece = piece(
    coord(-1, -1),
    coord(-1, 0),
    coord(0, -1),
    coord(0, 0),
    coord(0, -1)
);

/**
 * S Tetris piece definition.
 */
export const PIECE_S: Piece = piece(
    coord(0, 0),
    coord(-1, 0),
    coord(0, 1),
    coord(1, 1)
);

/**
 * T Tetris piece definition.
 */
export const PIECE_T: Piece = piece(
    coord(0, 0),
    coord(-1, 0),
    coord(0, -1),
    coord(1, 0)
);

/**
 * Z Tetris piece definition.
 */
export const PIECE_Z: Piece = piece(
    coord(0, 0),
    coord(1, -1),
    coord(0, -1),
    coord(-1, 0)
);

/**
 * All possible pieces in Tetris.
 */
export const PIECES: Piece[] = [PIECE_I, PIECE_J, PIECE_L, PIECE_O, PIECE_S, PIECE_T, PIECE_Z];

/**
 * A Tetris piece.
 */
export interface Piece {
  /**
   * The lower x bound of the piece, inclusive.
   */
  readonly minX: number;
  /**
   * The upper x bound of the piece, inclusive.
   */
  readonly maxX: number;
  /**
   * The lower y bound of the piece, inclusive.
   */
  readonly minY: number;
  /**
   * The upper y bound of the piece, inclusive.
   */
  readonly maxY: number;

  /**
   * Returns this piece by rotated 90 degrees.
   */
  rotate(): Piece;

  /**
   * Checks if the piece contains the given coordinates.
   * @param x The x coordinate to check.
   * @param y The y coordinate to check.
   */
  contains(x: number, y: number): boolean;

  /**
   * Checks if the two pieces are equal, including rotation.
   * @param piece The other piece to check equality with.
   */
  equals(piece: Piece): boolean;

  /**
   * Checks for equality between the two pieces ignoring rotation.
   * @param piece The other piece to check equality with.
   */
  sameShape(piece: Piece): boolean;

  /**
   * Calls the given function on each block the piece consists of.
   * @param fn The function to call on each block. It's given the coordinates of each block.
   */
  forEachBlock(fn: (x: number, y: number) => void): void;
}

/**
 * Creates a new block consisting of the given blocks and the point about which to rotate the piece.
 * @param a The coordinates of the first block this piece consists of.
 * @param b The coordinates of the second block this piece consists of.
 * @param c The coordinates of the third block this piece consists of.
 * @param d The coordinates of the fourth block this piece consists of.
 * @param rotationOrigin The point to rotate this piece about, default is the origin.
 */
function piece(a: Coordinate, b: Coordinate, c: Coordinate, d: Coordinate, rotationOrigin: Coordinate = coord(0, 0)): Piece {
  const coords = [a, b, c, d];

  function equals(piece: Piece): boolean {
    return coords.every(c => piece.contains(c.x, c.y));
  }

  return {
    minX: getMinX(coords),
    maxX: getMaxX(coords),
    minY: getMinY(coords),
    maxY: getMaxY(coords),
    rotate: () => {
      const [a, b, c, d] = coords.map(c => c.rotate90(rotationOrigin));
      return piece(a, b, c, d, rotationOrigin);
    },
    contains: (x: number, y: number): boolean => {
      return coords.some(c => c.x === x && c.y === y);
    },
    equals,
    sameShape: (other: Piece): boolean => {
      for (let i = 0; i < 4; i++) {
        if (equals(other)) {
          return true;
        }
        other = other.rotate();
      }
      return false;
    },
    forEachBlock: (fn: (x: number, y: number) => void): void => {
      coords.forEach(c => fn(c.x, c.y));
    }
  }
}

function getMinX(coords: Coordinate[]): number {
  return coords.map(c => c.x).reduce((x1, x2) => Math.min(x1, x2), Infinity);
}

function getMaxX(coords: Coordinate[]): number {
  return coords.map(c => c.x).reduce((x1, x2) => Math.max(x1, x2), -Infinity);
}

function getMinY(coords: Coordinate[]): number {
  return coords.map(c => c.y).reduce((y1, y2) => Math.min(y1, y2), Infinity);
}

function getMaxY(coords: Coordinate[]): number {
  return coords.map(c => c.y).reduce((y1, y2) => Math.max(y1, y2), -Infinity);
}

/**
 * A 2-dimensional coordinate.
 */
interface Coordinate {
  /**
   * The x coordinate.
   */
  readonly x: number;
  /**
   * The y coordinate.
   */
  readonly y: number;
  /**
   * Whether this coordinate is equal to the  other coordinate.
   */
  readonly equal: (c: Coordinate) => boolean;
  /**
   * Rotates the coordinate about the given point.
   */
  readonly rotate90: (origin: Coordinate) => Coordinate;
}

/**
 * Creates a new coordinate with the given x and y.
 * @param x The x coordinate.
 * @param y The y coordinate.
 */
function coord(x: number, y: number): Coordinate {
  return {
    x,
    y,
    equal: c => x === c.x && y === c.y,
    rotate90: (origin: Coordinate) => coord(y + origin.x, -x + origin.y)
  };
}