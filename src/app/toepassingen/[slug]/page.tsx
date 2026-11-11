import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { applications } from "@/components/marketing/cinematic-content";
import { ApplicationDetail } from "@/components/marketing/cinematic-subpage";

type ApplicationProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return applications.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ApplicationProps): Promise<Metadata> {
  const { slug } = await params;
  const application = applications.find(item => item.slug === slug);
  if (!application) notFound();
  return { title: `${application.title} | Nauvi`, description: application.description };
}

export default async function ApplicationPage({ params }: ApplicationProps) {
  const { slug } = await params;
  const application = applications.find(item => item.slug === slug);
  if (!application) notFound();
  return <ApplicationDetail application={application} />;
}
