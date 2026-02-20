import { useParams } from '@tanstack/react-router';

export default function Result() {
  const { id } = useParams({ strict: false });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold text-brand-navy">Result</h1>
      <p className="text-muted-foreground">Result ID: {id}</p>
      <p className="mt-2 text-muted-foreground">Result page - Coming soon</p>
    </div>
  );
}
