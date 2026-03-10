import { cn } from "@/lib/utils/cn";

type OwnerAvatarProps = {
  name: string;
  image?: string | null;
  className?: string;
};

function initials(name: string) {
  const words = name.trim().split(/\s+/);
  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

export function OwnerAvatar({ name, image, className }: OwnerAvatarProps) {
  return (
    <div
      className={cn(
        "relative inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/70 bg-gradient-to-br from-[rgba(79,124,255,0.25)] to-[rgba(139,124,255,0.3)] text-xs font-semibold text-[var(--text-heading)]",
        className,
      )}
      aria-label={name}
      title={name}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  );
}

