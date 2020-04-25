export const PIECE_I: Piece = piece(
    coord(-2, 1),
    coord(-1, 1),
    coord(0, 1),
    coord(1, 1)
);

export const PIECE_J: Piece = piece(
    coord(0, 0),
    coord(1, 1),
    coord(1, 0),
    coord(-1, 0)
);

export const PIECE_L: Piece = piece(
    coord(1, 0),
    coord(0, 0),
    coord(-1, 0),
    coord(-1, -1)
);

export const PIECE_O: Piece = piece(
    coord(1, 1),
    coord(1, 0),
    coord(0, 1),
    coord(0, 0)
);

export const PIECE_S: Piece = piece(
    coord(0, 0),
    coord(-1, 0),
    coord(0, 1),
    coord(1, 1)
);

export const PIECE_T: Piece = piece(
    coord(0, 0),
    coord(-1, 0),
    coord(0, -1),
    coord(1, 0)
);

export const PIECE_Z: Piece = piece(
    coord(0, 0),
    coord(1, -1),
    coord(0, -1),
    coord(-1, 0)
);

export const PIECES: Piece[] = [PIECE_I, PIECE_J, PIECE_L, PIECE_O, PIECE_S, PIECE_T, PIECE_Z];

export interface Piece {
  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;

  rotate(): Piece;

  contains(x: number, y: number): boolean;

  equals(piece: Piece): boolean;

  sameShape(piece: Piece): boolean;

  forEachBlock(fn: (x: number, y: number) => void): void;
}

function piece(a: Coordinate, b: Coordinate, c: Coordinate, d: Coordinate): Piece {
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
      const [a, b, c, d] = coords.map(c => c.rotate90());
      return piece(a, b, c, d);
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

interface Coordinate {
  readonly x: number;
  readonly y: number;
  readonly equal: (c: Coordinate) => boolean;
  readonly rotate90: () => Coordinate;
}

function coord(x: number, y: number): Coordinate {
  return {
    x,
    y,
    equal: c => x === c.x && y === c.y,
    rotate90: () => coord(y, -x)
  };
}