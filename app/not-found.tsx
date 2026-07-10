import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 pt-24 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="mt-4 text-xl text-muted">Page not found</p>
      <p className="mt-2 max-w-md text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button href="/" variant="secondary" size="lg" className="mt-8">
        <Home className="h-5 w-5" />
        Back to Home
      </Button>
    </div>
  );
}
