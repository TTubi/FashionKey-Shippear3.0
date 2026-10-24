type P = { size?: number };
const base = (size = 20) => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true });

export const CartIcon = ({ size }: P) => <svg {...base(size)}><path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6" /><circle cx="9" cy="20" r="1.2" /><circle cx="17" cy="20" r="1.2" /></svg>;
export const CloseIcon = ({ size }: P) => <svg {...base(size)}><path d="M6 6l12 12M18 6L6 18" /></svg>;
export const CheckIcon = ({ size }: P) => <svg {...base(size)}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
export const PlusIcon = ({ size }: P) => <svg {...base(size)}><path d="M12 5v14M5 12h14" /></svg>;
export const FingerprintIcon = ({ size }: P) => <svg {...base(size)}><path d="M12 11v3a8 8 0 0 1-1.5 4.7" /><path d="M8.5 11a3.5 3.5 0 0 1 7 0v1.5a12 12 0 0 1-.8 4.3" /><path d="M5.6 15.5A12 12 0 0 0 5.5 11a6.5 6.5 0 0 1 11.6-4" /><path d="M18.3 9.5c.1.5.2 1 .2 1.5v1a16 16 0 0 1-.6 4.5" /><path d="M4.2 7.5A9 9 0 0 1 12 3a9 9 0 0 1 4 .9" /></svg>;
export const NfcIcon = ({ size }: P) => <svg {...base(size)}><path d="M6 8.5a5 5 0 0 1 0 7" /><path d="M9.5 6a9 9 0 0 1 0 12" /><path d="M13 3.5a13 13 0 0 1 0 17" /></svg>;
export const LinkIcon = ({ size }: P) => <svg {...base(size)}><path d="M10 14a4 4 0 0 0 5.6 0l3-3a4 4 0 0 0-5.6-5.6l-1 1" /><path d="M14 10a4 4 0 0 0-5.6 0l-3 3a4 4 0 0 0 5.6 5.6l1-1" /></svg>;
export const ShieldIcon = ({ size }: P) => <svg {...base(size)}><path d="M12 3l7 3v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V6z" /><path d="M9 12l2 2 4-4" /></svg>;

export const featureIcons = { nfc: NfcIcon, fingerprint: FingerprintIcon, link: LinkIcon, shield: ShieldIcon };
