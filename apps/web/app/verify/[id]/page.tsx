export default async function VerifyResult({ params } : { params: { id: string } }) {
    const { id } = await params;
  return <main><h1>Verification: {id}</h1></main>;
}