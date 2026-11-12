import { MicrogreenStorefront } from "@/app/components/home/MicrogreenStorefront";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { StoreArticle } from "@/app/components/store/StoreArticle";
import { pageMeta } from "@/app/lib/site";
import { productJsonLd } from "@/app/lib/seo";

const description =
  "Microgreen trays grown to order at Jord Haus Farms in Redmond. Cut at the bench when they are ready. Pickup at the farm, not shipped.";

export const metadata = pageMeta({
  title: "Microgreens in Redmond",
  description,
  path: "/store/microgreens",
});

export default function MicrogreensPage() {
  return (
    <>
      <JsonLd
        data={productJsonLd({
          name: "Microgreen tray",
          description,
          path: "/store/microgreens",
          image: "/images/microgreens/microgreen-trays-horizon.jpg",
          lowPrice: "29.00",
        })}
      />
      <MicrogreenStorefront />
      <StoreArticle
        id="winter-greens"
        kicker="Microgreens"
        title="Dense food when the garden is quiet"
        lede="A tray of microgreens puts a lot of flavor and nutrition in a small harvest. That matters most in winter, when fresh local produce is hard to find."
        sections={[
          {
            heading: "A lot in a small tray",
            paragraphs: [
              "Microgreens are cut while the plant is still young and concentrated. Ounce for ounce they carry more of certain vitamins and minerals than the mature crop, so a small handful goes a long way on a plate. Radish, arugula, mustard, salad mix, wasabi, and cilantro each bring their own bite.",
            ],
          },
          {
            heading: "Winter, when the market thins out",
            paragraphs: [
              "From late fall through early spring, local lettuce and herbs slow down or come from far away. A tray sown on the bench in Redmond is still local and still fresh. Radish is ready in about 8 days. Arugula, mustard, and salad mix take about 10. Wasabi takes about 12, and cilantro about 21.",
            ],
          },
          {
            heading: "Cut the day you eat it",
            paragraphs: [
              "We sow after you order and cut the tray at the bench when it is ready. Pickup is at the farm. We do not ship trays, because they are at their best the day they are cut.",
            ],
          },
        ]}
      />
    </>
  );
}
