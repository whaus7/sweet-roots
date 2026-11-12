import { JsonLd } from "@/app/components/seo/JsonLd";
import { CatalogStorefront } from "@/app/components/store/CatalogStorefront";
import { StoreArticle } from "@/app/components/store/StoreArticle";
import { pageMeta } from "@/app/lib/site";
import { productJsonLd } from "@/app/lib/seo";

const description =
  "Continuous-flow worm bin kits from Jord Haus Farms. Feed the top, harvest castings from the bottom. Kits ship in the United States.";

export const metadata = pageMeta({
  title: "Continuous-flow worm bin kits",
  description,
  path: "/store/continuous-flow-bins",
});

export default function ContinuousFlowBedsPage() {
  return (
    <>
    <JsonLd
      data={productJsonLd({
        name: "Continuous-flow worm bin",
        description,
        path: "/store/continuous-flow-bins",
        image: "/images/store/continuous-flow-bin.jpg",
      })}
    />
    <CatalogStorefront
      label="The farm"
      title="Continuous-flow beds"
      intro="A raised bed that stays in production. Feed the top, harvest castings from the bottom, and keep the surface planted."
      photoSrc="/images/home/market-farm.jpg"
      photoAlt="Overhead view of the market farm, with planted rows and hoop houses"
      photoDim="bg-black/65"
      overlaySrc="/images/store/continuous-flow-bin.jpg"
      overlayAlt="Long white continuous-flow worm bin on a metal frame"
      story="Built at the Redmond farm. Tell us the length you want and we will talk it through. Kits ship in the United States."
    />
    <StoreArticle
      id="one-bin"
      kicker="Continuous-flow beds"
      title="One bin, not a stack of boxes"
      lede="A continuous-flow bin stays in production. Harvest the bottom, add to the top, and leave the worms where they are."
      sections={[
        {
          heading: "Less to manage",
          paragraphs: [
            "A pile of separate tubs means sorting, dumping, and starting over. Worms get mixed into the finished compost, and you spend the afternoon picking them out. A continuous-flow bin skips that. Finished castings settle at the bottom. The herd stays up top, in the fresh food.",
          ],
        },
        {
          heading: "The whole routine",
          paragraphs: [
            "Feed the surface. When the bottom is dark and crumbly, harvest it. Add bedding or scraps on top when the surface needs it. That is the day: harvest the bottom, add to the top, and you are done.",
          ],
        },
        {
          heading: "The kit",
          paragraphs: [
            "The kit is the long bed on a frame, built so you can pull castings from the low end. Tell us the length you want. Kits ship in the United States. We are not shipping kits to Canada yet.",
          ],
        },
      ]}
    />
    </>
  );
}
