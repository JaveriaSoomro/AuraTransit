import Image from "next/image";

export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <circle cx="40" cy="40" r="38.2" stroke="#145C63" strokeWidth="2.4" />
      <circle cx="40" cy="40" r="31.5" fill="#145C63" />
      <path
        d="M27.5 55.5 L40 22.5 L52.5 55.5"
        stroke="#F7F3E8"
        strokeWidth="5.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M33.2 45.8 H46.8"
        stroke="#F7F3E8"
        strokeWidth="5.2"
        strokeLinecap="round"
      />
      <path
        d="M19.5 49.5 C28.5 63, 53 62.5, 62.5 36.5"
        stroke="#F4C95D"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="62.5" cy="36.2" r="3.5" fill="#F4C95D" />
      <circle cx="40" cy="22.2" r="3.3" fill="#78B89A" />
    </svg>
  );
}

export function Logo({ className = "h-6 w-auto sm:h-7" }: { className?: string }) {
  return (
    <a href="#top" className="flex items-center" aria-label="AuraTransit home">
      <Image
        src="/auratransit.svg"
        alt="AuraTransit"
        width={114}
        height={28}
        className={className}
        style={{ width: "auto" }}
        priority
      />
    </a>
  );
}
