import type { Metadata } from "next";
import { SuccessView } from "./SuccessView";

export const metadata: Metadata = {
  title: "Order received",
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[#fcfcfc]">
      <SuccessView sessionId={sessionId} />
    </div>
  );
}
