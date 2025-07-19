import {
  CompactionData,
  CarbonToNitrogenData,
  BrixData,
  PlfaData,
  NPKData,
  MicroscopyData,
} from "../../LocalPageData";
import Link from "next/link";
import { Compaction } from "../../components/Compaction";
import CarbonToNitrogen from "../../components/CarbonToNitrogen";
import BrixMeter from "../../components/BrixMeter";
import Microscopy from "../../components/Microscopy";
import PLFA from "../../components/PLFA";
import NPK from "../../components/NPK";
import { Tile } from "../../components/Tile";
import Image from "next/image";

interface PageProps {
  params: {
    tileType: string;
  };
}

const tileDataMap = {
  compaction: CompactionData,
  brix: BrixData,
  cnratio: CarbonToNitrogenData,
  plfa: PlfaData,
  npk: NPKData,
  microscopy: MicroscopyData,
};

const tileTitles = {
  compaction: "Compaction Score",
  brix: "BRIX Score",
  cnratio: "Carbon to Nitrogen Ratio",
  plfa: "Polylipids Fatty Acid Profile",
  npk: "NPK Profile",
  microscopy: "Microscopy Sample",
};

// Component mapping for visual components
const visualComponents = {
  compaction: (props: any) => <Compaction value={190} size={200} />,
  brix: (props: any) => <BrixMeter brixValue={9} size={200} />,
  cnratio: (props: any) => <CarbonToNitrogen carbon={37} nitrogen={1} />,
  plfa: (props: any) => (
    <PLFA bacteria={45} fungi={30} protozoa={15} other={10} size={160} />
  ),
  npk: (props: any) => (
    <NPK nitrogen={52} phosphorus={5.2} potassium={175} size={160} />
  ),
  microscopy: (props: any) => <Microscopy size={200} />,
};

// Image mapping for testing tools
const testingToolImages = {
  compaction: "/images/compaction-penetrometer.jpg",
  brix: "/images/BRIX-meter.jpg",
  // Other tile types won't have images
};

// Device descriptions for testing tools
const deviceDescriptions = {
  compaction: {
    name: "Soil Penetrometer",
    description:
      "A soil penetrometer measures soil compaction by recording the force required to push a cone-shaped probe into the soil. The device displays readings in PSI (pounds per square inch), with higher values indicating more compacted soil that restricts root growth and water infiltration.",
  },
  brix: {
    name: "Refractometer",
    description:
      "A refractometer measures the sugar content in plant sap by analyzing how light bends through a drop of sap placed on the device's prism. The Brix scale (degrees Brix) indicates the concentration of dissolved solids, primarily sugars, which reflects the plant's nutritional status and soil health.",
  },
};

export default function DetailsPage({ params }: PageProps) {
  const { tileType } = params;
  const data = tileDataMap[tileType as keyof typeof tileDataMap];
  const title = tileTitles[tileType as keyof typeof tileTitles];
  const VisualComponent =
    visualComponents[tileType as keyof typeof visualComponents];
  const hasImage = tileType in testingToolImages;

  if (!data) {
    return <div>Tile type not found</div>;
  }

  return (
    <div className="flex p-5 justify-center w-full details-page">
      <div className="w-full max-w-[1100px]">
        {/* Flexbox layout for tiles */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* Left column - content tiles */}
          <div className="flex-1 space-y-4">
            <Tile type="what" title={`What is ${title}`}>
              <div
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ __html: data.what }}
              />
            </Tile>

            <Tile type="why" title={`Why is ${title} Important`}>
              <div
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ __html: data.why }}
              />
            </Tile>

            <Tile type="solutions" title="Solutions">
              <div
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ __html: data.solutions }}
              />
            </Tile>
          </div>

          {/* Right column - visual tiles */}
          <div className="lg:w-90 space-y-4">
            <Tile type="visualization" title="Visualization">
              <div className="flex justify-center items-center">
                {VisualComponent && <VisualComponent />}
              </div>
            </Tile>

            {hasImage && (
              <Tile type="testing-tool" title="Testing Device" altStyle={true}>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 leading-relaxed">
                    <b>
                      {
                        deviceDescriptions[
                          tileType as keyof typeof deviceDescriptions
                        ]?.name
                      }
                      :{" "}
                    </b>
                    {
                      deviceDescriptions[
                        tileType as keyof typeof deviceDescriptions
                      ]?.description
                    }
                  </div>
                  <div className="flex justify-center items-center">
                    <Image
                      src={
                        testingToolImages[
                          tileType as keyof typeof testingToolImages
                        ]
                      }
                      alt={`${title} testing tool`}
                      width={300}
                      height={200}
                      className="rounded-lg"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
              </Tile>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
