import { AlertCircle, Search } from "lucide-react";
import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  valueClassName,
  className
}: {
  icon: React.ElementType;
  label: React.ReactNode;
  value: React.ReactNode | string;
  subtext?: React.ReactNode;
  valueClassName?: string;
  className?: string;
}) {
  return (
    <Card className={cn("border-none bg-muted/30 shadow-elevation-1 hover:bg-muted/50", className)}>
      <CardContent className="flex flex-col items-center gap-space-xs p-space-md text-center">
        <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-background text-primary shadow-elevation-1">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="space-y-0.5">
          <p className="text-caption text-muted-foreground uppercase tracking-wide">{label}</p>
          <div className={cn("text-title text-foreground", valueClassName)}>{value}</div>
          {subtext && <p className="text-caption text-success">{subtext}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export function SectionCard({
  icon: Icon,
  title,
  children,
  className,
  contentClassName
}: {
  icon?: React.ElementType;
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <Card className={cn("shadow-elevation-1", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-space-xs text-subtitle">
          {Icon ? <Icon className="h-5 w-5 text-primary" aria-hidden="true" /> : null}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={cn("space-y-space-md", contentClassName)}>{children}</CardContent>
    </Card>
  );
}

export function EmptyState({
  title,
  description,
  icon: Icon = AlertCircle,
  className
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ElementType;
  className?: string;
}) {
  return (
    <div className={cn("flex h-64 w-full flex-col items-center justify-center", className)}>
      <Icon className="mb-space-sm h-10 w-10 text-muted-foreground" aria-hidden="true" />
      <h3 className="text-subtitle text-foreground">{title}</h3>
      {description ? <p className="text-body text-muted-foreground">{description}</p> : null}
    </div>
  );
}

export function ErrorState({
  title,
  description,
  retryAction,
  className
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  retryAction?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border border-destructive/30 bg-destructive/10 p-space-lg text-destructive",
        className
      )}
    >
      <h4 className="text-subtitle">{title}</h4>
      {description ? (
        <p className="mt-space-xs text-body text-destructive/80">{description}</p>
      ) : null}
      {retryAction ? <div className="mt-space-sm">{retryAction}</div> : null}
    </div>
  );
}

export function FilterBar({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-space-sm rounded-lg border bg-card p-space-sm shadow-elevation-1 md:flex-row md:items-center md:justify-between",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder,
  name,
  className
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Input
        type="search"
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder || "Search"}
        className="h-9 w-64 rounded-full border border-border/60 bg-background/80 px-4 pr-10 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-primary"
      />
      <Search className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
