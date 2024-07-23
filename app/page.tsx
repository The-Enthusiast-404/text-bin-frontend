import { Suspense } from "react";
import HomeComponent from "@/components/HomeComponent";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeComponent />
    </Suspense>
  );
}
