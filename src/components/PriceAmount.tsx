
interface PriceAmountProps {
    value: number;
}

export function PriceAmount({ value }: PriceAmountProps) {


    return <span>{value}</span>;
}