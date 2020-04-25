import * as React from "react";
import {Block} from "./Block";

export interface BoardProps {
  readonly width: number;
  readonly height: number;
  readonly blockColors: Array<Array<string | undefined>>;
}

export const Board = (props: BoardProps) => {
  const blockSize = 40;
  const tableWidth = props.width * blockSize;
  const tableHeight = props.height * blockSize;

  const xCoords: Array<number> = Array.from(Array(props.width).keys());
  const yCoords: Array<number> = Array.from(Array(props.height).keys());

  return (
      <table style={{width: tableWidth, height: tableHeight, borderSpacing: 0}}>
        <tbody>
        {yCoords.map((y: number) => (
            <tr key={y}>
              {xCoords.map((x: number) => (
                  <td key={x}>
                    <Block color={props.blockColors[x][props.height - y - 1]}/>
                  </td>
              ))}
            </tr>
        ))}
        </tbody>
      </table>
  );
};