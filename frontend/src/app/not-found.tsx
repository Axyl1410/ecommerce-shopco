"use client";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import Link from "next/link";

/**
 * Render a centered 404 Not Found page with a message and actions to navigate home or contact support.
 *
 * The UI uses Empty primitives to display a title, a short description, and two action buttons:
 * "Go to Home" (internal link to "/") and "Contact Support" (external link to the repository issues page).
 *
 * @returns A React element representing the 404 Not Found page.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>404 - Not Found</EmptyTitle>
          <EmptyDescription>
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/">
              <Button type="button">Go to Home</Button>
            </Link>
            <Link href="https://github.com/Axyl1410/ecommerce-shopco/issues/new">
              <Button type="button" variant="outline">
                Contact Support
              </Button>
            </Link>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}