import type { Metadata } from "next";
import { CancelView } from "./CancelView";

export const metadata: Metadata = {
  title: "Checkout canceled",
  robots: { index: false, follow: false },
};

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[#fcfcfc]">
      <CancelView />
    </div>
  );
}
