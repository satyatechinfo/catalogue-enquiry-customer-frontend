export default function SectionHeading({ eyebrow, title, text, align = 'center', as: Tag = 'h2', id }) {
  return (
    <header className={`section-heading section-heading--${align}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag id={id}>{title}</Tag>
      {text && <p className="section-heading__text">{text}</p>}
    </header>
  );
}
