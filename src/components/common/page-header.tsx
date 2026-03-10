type PageHeaderProps = {
  title: string;
  description: string;
  actions?: React.ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="surface-card-strong mb-6 flex flex-wrap items-start justify-between gap-4 p-5 md:p-6">
      <div className="max-w-3xl min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-heading md:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted md:text-base">{description}</p>
      </div>
      {actions ? <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">{actions}</div> : null}
    </header>
  );
}

