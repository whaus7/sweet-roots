import { JsonLd } from "@/app/components/seo/JsonLd";
import { StoreArticle } from "@/app/components/store/StoreArticle";
import { WormBinStory } from "@/app/components/store/WormBinStory";
import { WormsStorefront } from "@/app/components/store/WormsStorefront";
import { pageMeta } from "@/app/lib/site";
import { productJsonLd } from "@/app/lib/seo";

const description =
  "Live European red wigglers for compost bins and beds. Packed at Jord Haus Farms in Redmond and shipped in the United States.";

export const metadata = pageMeta({
  title: "Composting worms shipped in the US",
  description,
  path: "/store/composting-worms",
});

export default function CompostingWormsPage() {
  return (
    <>
      <JsonLd
        data={productJsonLd({
          name: "Composting worms",
          description,
          path: "/store/composting-worms",
          image: "/images/worms/red-wigglers.webp",
          lowPrice: "19.95",
          highPrice: "34.95",
          shipsInUs: true,
        })}
      />
      <WormsStorefront />
      <WormBinStory />
      <StoreArticle
        id="bioreactors"
        kicker="Composting worms"
        title="Nature's bioreactors"
        lede="A red wiggler is a living bioreactor. Scraps go in one end. The gut turns them into castings a bed can use."
        sections={[
          {
            heading: "The gut does the work",
            paragraphs: [
              "A worm does more than chew. Its gut carries a community of microbes, and that community is what breaks scraps down and works minerals into forms a root can take up. The casting that leaves the worm is the finished batch: ground food, freed nutrients, and the microbes still in it.",
              "Those microbes keep working after the casting is in the soil. They help hold nutrients where roots can reach them, instead of letting them wash through. You are adding the reactor's output, not a bag of salt.",
            ],
          },
          {
            heading: "A herd from the farm",
            paragraphs: [
              "A 100-count herd starts a household bin. A 300-count herd stocks a larger bin and starts producing sooner. Both ship live in the United States. We hold a box through a hard freeze or a heat wave rather than send worms into weather that would cook or freeze them. We do not ship live worms to Canada yet.",
            ],
          },
        ]}
      />
    </>
  );
}
