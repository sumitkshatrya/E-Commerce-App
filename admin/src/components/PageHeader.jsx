const PageHeader = ({ eyebrow, title, subtitle, actions }) => {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-admin-border bg-admin-surface/90 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? <p className="section-title">{eyebrow}</p> : null}
        <h1 className="mt-2 text-2xl font-semibold text-admin-text">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-sm text-admin-muted">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
};

export default PageHeader;
