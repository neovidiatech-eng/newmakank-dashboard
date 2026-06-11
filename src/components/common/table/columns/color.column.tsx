


export default function ColorCol({
    value
}: {
    value: string
}) {
    return (
        <div
            className="size-8 rounded-full "
            style={{
                background: value
            }}
        />
    )
}