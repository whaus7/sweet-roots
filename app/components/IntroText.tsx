interface IntroTextProps {
  title?: string;
  text: string;
  maxChars?: number;
}

const IntroText = ({ title, text, maxChars }: IntroTextProps) => {
  const shouldTruncate = maxChars && text.length > maxChars;
  const displayText = shouldTruncate
    ? text.substring(0, maxChars) + "..."
    : text;

  return (
    <div className="mb-4">
      {title && <div className="tileTitle mb-1">{title}</div>}
      <div
        className="text-sm"
        dangerouslySetInnerHTML={{ __html: displayText }}
      />
    </div>
  );
};

export default IntroText;
