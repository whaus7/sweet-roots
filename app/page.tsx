import Image from "next/image";
import { Tile } from "./components/Tile";
import { Compaction } from "./components/Compaction";
import CarbonToNitrogen from "./components/CarbonToNitrogen";
import BrixMeter from "./components/BrixMeter";
import Microscopy from "./components/Microscopy";
import PLFA from "./components/PLFA";
import NPK from "./components/NPK";
import IntroText from "./components/IntroText";
import {
  CompactionData,
  CarbonToNitrogenData,
  BrixData,
  PlfaData,
  NPKData,
  MicroscopyData,
} from "./LocalPageData";

export default function Home() {
  return (
    <div className="flex p-5 justify-center w-full">
      <div id="dashboard" className="w-full max-w-[1100]">
        <Tile type="compaction" title="Compaction Score" tileType="compaction">
          <Compaction value={190} size={160} />
          <IntroText title="What" text={CompactionData.what} maxChars={100} />
          <IntroText title="Why" text={CompactionData.why} maxChars={100} />
          <IntroText
            title="Solutions"
            text={CompactionData.solutions}
            maxChars={100}
          />
        </Tile>
        <Tile type="brix" title="BRIX Score" tileType="brix">
          <BrixMeter brixValue={9} size={160} />
          <IntroText title="What" text={BrixData.what} maxChars={100} />
          <IntroText title="Why" text={BrixData.why} maxChars={100} />
          <IntroText
            title="Solutions"
            text={BrixData.solutions}
            maxChars={100}
          />
        </Tile>
        <Tile
          type="cnratio"
          title="Carbon to Nitrogen Ratio"
          tileType="cnratio"
        >
          <CarbonToNitrogen carbon={37} nitrogen={1} />
          <IntroText
            title="What"
            text={CarbonToNitrogenData.what}
            maxChars={100}
          />
          <IntroText
            title="Why"
            text={CarbonToNitrogenData.why}
            maxChars={100}
          />
          <IntroText
            title="Solutions"
            text={CarbonToNitrogenData.solutions}
            maxChars={100}
          />
        </Tile>
        <Tile type="plfa" title="Polylipids Fatty Acid Profile" tileType="plfa">
          <PLFA bacteria={45} fungi={30} protozoa={15} other={10} size={160} />
          <IntroText title="What" text={PlfaData.what} maxChars={100} />
          <IntroText title="Why" text={PlfaData.why} maxChars={100} />
          <IntroText
            title="Solutions"
            text={PlfaData.solutions}
            maxChars={100}
          />
        </Tile>
        <Tile type="npk" title="NPK Profile" tileType="npk">
          <NPK nitrogen={52} phosphorus={5.2} potassium={175} size={160} />
          <IntroText title="What" text={NPKData.what} maxChars={100} />
          <IntroText title="Why" text={NPKData.why} maxChars={100} />
          <IntroText
            title="Solutions"
            text={NPKData.solutions}
            maxChars={100}
          />
        </Tile>
        <Tile type="microscopy" title="Microscopy Sample" tileType="microscopy">
          <Microscopy size={160} />
          <IntroText title="What" text={MicroscopyData.what} maxChars={100} />
          <IntroText title="Why" text={MicroscopyData.why} maxChars={100} />
          <IntroText
            title="Solutions"
            text={MicroscopyData.solutions}
            maxChars={100}
          />
        </Tile>
      </div>
    </div>
  );
}
