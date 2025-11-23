import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Renders a styled container used as the empty-state wrapper.
 *
 * Merges any provided `className` with the component's base styles, exposes
 * `data-slot="empty"`, and forwards remaining props to the underlying `div`.
 *
 * @returns A `div` element that serves as the empty-state container.
 */
function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 text-balance rounded-lg border-dashed p-6 text-center md:p-12",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the header slot for an empty-state component.
 *
 * @returns The rendered empty-state header element.
 */
function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        "flex max-w-sm flex-col items-center gap-2 text-center",
        className
      )}
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Renders the media/icon container for an empty state and applies variant-specific styling.
 *
 * @param variant - Visual variant to apply; available values: `"default"` (larger media with caption support) or `"icon"` (compact icon-only layout)
 * @returns The div element used as the empty state's media/icon container
 */
function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

/**
 * Renders the title area for an empty state.
 *
 * The component outputs a `div` with a `data-slot="empty-title"` attribute and base typographic classes;
 * any `className` provided is merged with the default classes and remaining props are forwarded to the element.
 *
 * @param className - Additional CSS classes to merge with the default title classes
 * @param props - Additional props applied to the underlying `div` element
 * @returns The `div` element used as the empty-state title
 */
function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn("text-lg font-medium tracking-tight", className)}
      {...props}
    />
  )
}

/**
 * Renders the empty-state description element with muted text and formatted links.
 *
 * @param className - Additional CSS classes to merge with the component's base styles.
 * @param props - Other native paragraph props applied to the rendered element.
 * @returns The description element used inside an empty state layout.
 */
function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        "text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a centered vertical container for empty-state content.
 *
 * @returns A div element that serves as the empty-state content container.
 */
function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full min-w-0 max-w-sm flex-col items-center gap-4 text-balance text-sm",
        className
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
}