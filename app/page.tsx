import Link from "next/link";
import { Tile } from "./components/Tile";
import { CompactionMeter } from "./components/CompactionMeter";
import CarbonToNitrogenMeter from "./components/CarbonToNitrogenMeter";
import BrixMeter from "./components/BrixMeter";
import Microscopy from "./components/Microscopy";
import PLFAMeter from "./components/PLFAMeter";
import NPKMeter from "./components/NPKMeter";
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
          <CompactionMeter value={190} size={160} />

          <IntroText
            title="What is a Compaction Test?"
            text={CompactionData.what}
            maxChars={140}
          />
          <div className="flex justify-end gap-4 mt-4">
            <Link
              href={`/details/compaction`}
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Learn more
            </Link>
          </div>
        </Tile>
        <Tile type="brix" title="Brix Score" tileType="brix">
          <BrixMeter brixValue={9} />
          <IntroText
            title="What is Brix Test?"
            text={BrixData.what}
            maxChars={100}
          />
          <div className="flex justify-end gap-4 mt-4">
            <Link
              href={"/brix-logs"}
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Log Readings
            </Link>
            <Link
              href={`/details/brix`}
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Learn more
            </Link>
          </div>
        </Tile>
        <Tile type="plfa" title="Polylipids Fatty Acid Profile" tileType="plfa">
          <PLFAMeter
            bacteria={45}
            fungi={30}
            protozoa={15}
            other={10}
            size={160}
          />
          <IntroText
            title="What is a PLFA Test?"
            text={PlfaData.what}
            maxChars={140}
          />
          <div className="flex justify-end gap-4 mt-4">
            <Link
              href={"/history/plfa"}
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Log Readings
            </Link>
            <Link
              href={`/details/plfa`}
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Learn more
            </Link>
          </div>
        </Tile>

        <Tile type="npk" title="NPK Profile" tileType="npk">
          <NPKMeter nitrogen={52} phosphorus={5.2} potassium={175} size={160} />
          <div className="py-2"></div>
          <IntroText title="What is NPK?" text={NPKData.what} maxChars={90} />
          <div className="flex justify-end gap-4 mt-4">
            {/* <Link
              href={"/history/plfa"}
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Log Readings
            </Link> */}
            <Link
              href={`/details/npk`}
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Learn more
            </Link>
          </div>
        </Tile>
        <Tile type="microscopy" title="Microscopy Sample" tileType="microscopy">
          <Microscopy />
          <IntroText
            title="What is Microscopy"
            text={MicroscopyData.what}
            maxChars={100}
          />
          <div className="flex justify-end gap-4 mt-4">
            {/* <Link
              href={"/history/plfa"}
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Log Readings
            </Link> */}
            <Link
              href={`/details/microscopy`}
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Learn more
            </Link>
          </div>
        </Tile>
        <Tile
          type="cnratio"
          title="Carbon to Nitrogen Ratio"
          tileType="cnratio"
        >
          <CarbonToNitrogenMeter carbon={37} nitrogen={1} />
          <div className="py-2"></div>
          <IntroText
            title="Why is Ratio Important?"
            text={CarbonToNitrogenData.what}
            maxChars={155}
          />
          <div className="flex justify-end gap-4 mt-4">
            {/* <Link
              href={"/history/plfa"}
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Log Readings
            </Link> */}
            <Link
              href={`/details/cnratio`}
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Learn more
            </Link>
          </div>
        </Tile>
      </div>
    </div>
  );
}
