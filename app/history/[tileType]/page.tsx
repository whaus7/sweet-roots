"use client";

import { useParams } from "next/navigation";
import { CompactionGraph } from "../../components/CompactionGraph";
import CarbonToNitrogenGraph from "../../components/CarbonToNitrogenGraph";
import BrixGraph from "../../components/BrixGraph";
import Microscopy from "../../components/Microscopy";
import PLFAGraph from "../../components/PLFAGraph";
import NPKGraph from "../../components/NPKGraph";
import {
  CompactionData,
  CarbonToNitrogenData,
  BrixData,
  PlfaData,
  NPKData,
  MicroscopyData,
} from "../../LocalPageData";

export default function HistoryPage() {
  const params = useParams();
  const tileType = params.tileType as string;

  const getTileData = () => {
    switch (tileType) {
      case "compaction":
        return {
          title: "Compaction Score History",
          component: <CompactionGraph />,
          data: CompactionData,
        };
      case "brix":
        return {
          title: "Brix Score History",
          component: <BrixGraph />,
          data: BrixData,
        };
      case "plfa":
        return {
          title: "Polylipids Fatty Acid Profile History",
          component: <PLFAGraph />,
          data: PlfaData,
        };
      case "npk":
        return {
          title: "NPK Profile History",
          component: <NPKGraph />,
          data: NPKData,
        };
      case "microscopy":
        return {
          title: "Microscopy Sample History",
          component: <Microscopy showHistoryOnly={true} />,
          data: MicroscopyData,
        };
      case "cnratio":
        return {
          title: "Carbon to Nitrogen Ratio History",
          component: <CarbonToNitrogenGraph />,
          data: CarbonToNitrogenData,
        };
      default:
        return null;
    }
  };

  const tileData = getTileData();

  if (!tileData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600">
            The requested history page does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-800 underline text-sm mb-4 inline-block"
          >
            ← Back to Dashboard
          </a>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">
            {tileData.title}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main History Component */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {tileData.component}
            </div>
          </div>

          {/* Information Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                About This Test
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    What is this?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {tileData.data.what}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Why is it important?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {tileData.data.why}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Solutions & Recommendations
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {tileData.data.solutions}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
