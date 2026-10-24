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

export const MaskIcon = ({ size }: P) => <svg {...base(size)}><path d="M4 6c5-2 11-2 16 0 0 7-3 12-8 13-5-1-8-6-8-13z" /><path d="M8 11c1-.8 2-.8 3 0M13 11c1-.8 2-.8 3 0M9.5 15.5c1.5 1 3.5 1 5 0" /></svg>;
export const ScanIcon = ({ size }: P) => <svg {...base(size)}><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" /><circle cx="12" cy="10" r="2.5" /><path d="M7.5 17a5 5 0 0 1 9 0" /></svg>;
export const MailIcon = ({ size }: P) => <svg {...base(size)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 6.5l8.5 6 8.5-6" /></svg>;
export const KeyIcon = ({ size }: P) => <svg {...base(size)}><circle cx="8" cy="15" r="4" /><path d="M11 12l8-8M16 7l2 2M14 9l2 2" /></svg>;
export const GemIcon = ({ size }: P) => <svg {...base(size)}><path d="M6 4h12l3 5-9 11L3 9z" /><path d="M3 9h18M9 4l3 16 3-16" /></svg>;
export const TapIcon = ({ size }: P) => <svg {...base(size)}><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11" /><path d="M12 10.5a1.5 1.5 0 0 1 3 0V12a1.5 1.5 0 0 1 3 0v3a6 6 0 0 1-6 6h-.5a6 6 0 0 1-4.6-2.2L4.5 15.5a1.5 1.5 0 0 1 2.3-1.9L9 16" /></svg>;
export const GlobeIcon = ({ size }: P) => <svg {...base(size)}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" /></svg>;
export const LockIcon = ({ size }: P) => <svg {...base(size)}><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2" /></svg>;

export const featureIcons = { nfc: NfcIcon, fingerprint: FingerprintIcon, link: LinkIcon, shield: ShieldIcon, mask: MaskIcon, scan: ScanIcon, mail: MailIcon, key: KeyIcon, gem: GemIcon, tap: TapIcon, globe: GlobeIcon, lock: LockIcon, check: CheckIcon };
export type FeatureIcon = keyof typeof featureIcons;
