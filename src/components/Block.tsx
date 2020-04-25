import * as React from "react";

export interface BlockProps {
  readonly color: string | undefined;
}

export const Block = (props: BlockProps) => {
  return (
      <span style={{width: "100%", height: "100%", backgroundColor: props.color || 'black', display: "flex"}}/>
  );
};