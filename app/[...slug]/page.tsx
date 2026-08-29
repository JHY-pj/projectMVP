import { RouteScreen } from "@/components/route-screen"

export default async function RoutedPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  return <RouteScreen segments={slug} />
}
