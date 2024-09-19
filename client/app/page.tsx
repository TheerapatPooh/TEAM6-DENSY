import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardAddExample, CardShowExample } from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex space-x-5 m-10">
      <CardAddExample />
      <CardShowExample />
    </div>
  );
}
