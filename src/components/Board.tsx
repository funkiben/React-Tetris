import * as React from "react";
import {Block} from "./Block";

export interface BoardProps {
  readonly width: number;
  readonly height: number;
  readonly blockColors: Array<Array<string | undefined>>;
}

export const Board = (props: BoardProps) => {
  const xCoords: Array<number> = Array.from(Array(props.width).keys());
  const yCoords: Array<number> = Array.from(Array(props.height).keys());

  return (
      <div style={{position: "relative", width: "22.5%", paddingBottom: "45%", float: "left", height: 0}}>
        <table style={{width: "100%", height: "100%", position: "absolute", left: 0}}>
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
      </div>

  );
};