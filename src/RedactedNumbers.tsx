export function RedactedNumbers({ count = 1 }: { count?: number }) {
  const arr = Array(count).fill(0);
  return (
    <span>
      {arr.map((_, i) => (
        <span className="redact" key={i}>
          0
        </span>
      ))}
    </span>
  );
}
