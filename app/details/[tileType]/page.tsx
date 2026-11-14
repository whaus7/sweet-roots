import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  CompactionData,
  CarbonToNitrogenData,
  BrixData,
  PlfaData,
  NPKData,
  MicroscopyData,
} from "../../LocalPageData";
import { CompactionMeter } from "../../components/CompactionMeter";
import CarbonToNitrogenMeter from "../../components/CarbonToNitrogenMeter";
import BrixMeter from "../../components/BrixMeter";
import Microscopy from "../../components/Microscopy";
import PLFADonutChart from "../../components/PLFADonutChart";
import NPKMeter from "../../components/NPKMeter";
import { Tile } from "../../components/Tile";
import { pageMeta } from "@/app/lib/site";

interface PageProps {
  params: Promise<{
    tileType: string;
  }>;
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

const educationPages = {
  compaction: {
    title: "Soil Compaction Test",
    description:
      "What a soil compaction test measures with a penetrometer, and how a packed layer slows roots, water, and air.",
  },
  brix: {
    title: "Plant Brix Test",
    description:
      "What a plant Brix test measures with a refractometer, and what the sugar level in the sap says about the plant.",
  },
  plfa: {
    title: "PLFA Soil Test",
    description:
      "What a PLFA soil test reads from microbial cell membranes, and how the mix of bacteria and fungi describes the soil.",
  },
  npk: {
    title: "NPK Soil Test",
    description:
      "What an NPK soil test measures in nitrogen, phosphorus, and potassium, and how a shortage of each one shows up in the crop.",
  },
  microscopy: {
    title: "Soil Microscopy",
    description:
      "What a soil microscope shows: aggregates, fungal threads, bacteria, and other living parts of the soil.",
  },
  cnratio: {
    title: "Soil Carbon to Nitrogen Ratio",
    description:
      "What a soil carbon to nitrogen ratio means for decomposition, and when organic matter releases nitrogen or ties it up.",
  },
} as const;

type EducationSlug = keyof typeof educationPages;

function isEducationSlug(value: string): value is EducationSlug {
  return Object.prototype.hasOwnProperty.call(educationPages, value);
}

export function generateStaticParams() {
  return (Object.keys(educationPages) as EducationSlug[]).map((tileType) => ({
    tileType,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tileType } = await params;
  if (!isEducationSlug(tileType)) notFound();
  const page = educationPages[tileType];
  return pageMeta({
    title: page.title,
    description: page.description,
    path: `/details/${tileType}`,
  });
}

// Component mapping for visual components
const visualComponents = {
  compaction: () => <CompactionMeter value={190} size={160} />,
  brix: () => <BrixMeter brixValue={9} />,
  cnratio: () => <CarbonToNitrogenMeter carbon={37} nitrogen={1} />,
  plfa: () => (
    <PLFADonutChart
      bacteria={45}
      fungi={30}
      protozoa={15}
      other={10}
      size={160}
    />
  ),
  npk: () => (
    <NPKMeter nitrogen={52} phosphorus={5.2} potassium={175} size={160} />
  ),
  microscopy: () => <Microscopy />,
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

export default async function DetailsPage({ params }: PageProps) {
  const { tileType } = await params;
  const data = tileDataMap[tileType as keyof typeof tileDataMap];
  const title = tileTitles[tileType as keyof typeof tileTitles];
  const VisualComponent =
    visualComponents[tileType as keyof typeof visualComponents];
  const hasImage = tileType in testingToolImages;

  if (!data || !title) {
    notFound();
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
