interface Props {
  brand: string;
  brandColor: string;
  name: string;
  lastFour: string;
  amount: string;
  dueText: string;
}

export default function CardItem({
  brand,
  brandColor,
  name,
  lastFour,
  amount,
  dueText,
}: Props) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/40">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-8 ${brandColor} rounded flex items-center justify-center text-xs text-white font-bold`}
        >
          {brand}
        </div>

        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-xs text-muted-foreground">
            Ends in •••• {lastFour}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="font-bold">{amount}</p>
        <p className="text-xs text-muted-foreground">{dueText}</p>
      </div>
    </div>
  );
}
