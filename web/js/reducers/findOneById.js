export default function findOneById(results, id) {
  return (
    results?.filter((result) => result.id === parseInt(id, 10))?.[0] ?? null
  );
}
