function PageHeader({ title, description }) {
  return (
    <header className="page-header">
      <div className="page-header__title">{title}</div>
      <div className="page-header__description">{description}</div>
    </header>
  );
}

export default PageHeader;
