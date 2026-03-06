interface Props {
  percent: number;
}

export default function CreditUtilization({ percent }: Props) {
  return (
    <div className="w-full bg-muted rounded-full h-2.5 mt-4">
      <div
        className="bg-green-500 h-2.5 rounded-full"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
