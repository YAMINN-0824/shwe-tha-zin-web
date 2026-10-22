import fritters from "../../../public/images/fritters.png";
import hometownGate from "../../../public/images/hometown-gate.jpg";
import laphet from "../../../public/images/laphet.png";
import mya from "../../../public/images/mya.png";
import riceSet from "../../../public/images/rice-set.png";

// サイトで使う写真（DESIGN.md「写真」）
// import すると、幅と高さが自動で入る。料理は切り抜き（すける PNG）
// 母の写真そのものは使わない（マスコットの絵だけ）
export const photos = {
  laphet,
  "rice-set": riceSet,
  fritters,
  "hometown-gate": hometownGate,
  // 母（ミャー）のマスコット。はじめから背景がすけている絵
  mya,
};

export type PhotoName = keyof typeof photos;
