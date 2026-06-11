import TextCol from "./text.column";


export default function LocaleViewColumn({ value }: {
    value: {
        en?: string;
        ar?: string;
    }
}) {
    return (
        <div className="flex flex-col gap-1">
            <TextCol text={`EN: ${value.en || '-'}`} />
            <TextCol text={`العربيه: ${value.ar || '-'}`} />
        </div>
    );
}