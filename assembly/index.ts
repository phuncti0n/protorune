import { Box } from "metashrew-as/assembly/utils/box";
import { _flush, input } from "metashrew-as/assembly/indexer/index";
import { Block } from "metashrew-as/assembly/blockdata/block";
import { parsePrimitive } from "metashrew-as/assembly/utils/utils";
import { DefaultProtorune, Protorune } from "./indexer";
import { MessageContext } from "./indexer/protomessage";
import { GENESIS } from "metashrew-runes/assembly/indexer/constants";
import { SpendablesIndex } from "metashrew-spendables/assembly/indexer";

export function trap(): void {
  unreachable();
}

export function _start(): void {
  const data = input();
  const box = Box.from(data);
  const height = parsePrimitive<u32>(box);
  // if (height < GENESIS - 6) {
  //   _flush();
  //   return;
  // }
  const block = new Block(box);

  new SpendablesIndex().indexBlock(height, block);
  //}
  new DefaultProtorune().indexBlock(height, block);
  _flush();
}

export * from "./view";
export * from "./test";
