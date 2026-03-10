import Link from "next/link";
import { Button } from "@/components/common/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="surface-card max-w-lg p-8 text-center">
        <h1 className="text-3xl font-semibold text-heading">Page not found</h1>
        <p className="mt-3 text-sm text-muted">The requested resource does not exist or may have been removed.</p>
        <div className="mt-5">
          <Link href="/dashboard">
            <Button>Return to dashboard</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

