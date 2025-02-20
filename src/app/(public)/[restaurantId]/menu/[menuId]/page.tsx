export default async function PublicMenuPage({ params }: { params: Promise<{ menuId: string }> }) {

  return <pre>{JSON.stringify(await params, null, 2)}</pre>
}