import { contactEmail, members } from '../site';

export function KeepTogether({ children }) {
  return <span className="keep-together">{children}</span>;
}

export function MemberNames() {
  return members.map((name, index) => (
    <span key={name}>
      {index > 0 && ' and '}
      <KeepTogether>{name}</KeepTogether>
    </span>
  ));
}

export function Email({ children = contactEmail, ...props }) {
  return (
    <a href={`mailto:${contactEmail}`} {...props}>
      {children}
    </a>
  );
}
