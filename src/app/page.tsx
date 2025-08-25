import CouponRoulette from "@/components/coupon-roulette";


export const metadata = {
  title: "Roleta de Cupons",
  description: "Participe da roleta de cupons da Parmegiana Crocante!",
};

export default function Home() {
  return (
    <div className="relative min-h-screen font-[family-name:var(--font-geist-sans)]">
      <CouponRoulette />
      <div className="absolute bottom-0 left-0 right-0">
      </div>
    </div>
  );
}