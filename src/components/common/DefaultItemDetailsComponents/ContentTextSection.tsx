import KeyLabel from "@/components/ui/KeyLabel";

function ContentTextSection({ label, content }: { label: string; content: string | number }) {
  if (label === "status" || label === "reservationStatus") {
    const statusClass =
      content.toString().toLowerCase() === "active"
        ? "bg-success/20 text-success-foreground"
        : "bg-destructive/20 text-destructive-foreground";

    return (
      <div className="flex items-center gap-2">
        <KeyLabel label={label} />
        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusClass}`}>
          {content}
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-3 py-1.5"
      style={{
        width: "100%",
        maxWidth: "100%",
        overflowWrap: "break-word",
        whiteSpace: "normal",
        wordBreak: "break-word",
        overflow: "visible"
      }}
    >
      <KeyLabel label={label} />
      <span className="text-card-foreground">{content}</span>
    </div>
  );
}

export default ContentTextSection;
