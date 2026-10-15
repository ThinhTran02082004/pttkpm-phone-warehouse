function AlertBanner({ type = 'info', children }) {
  const className =
    type === 'error'
      ? 'shell-alert shell-alert--error'
      : 'shell-alert shell-alert--success';

  return (
    <div className={className} role="alert">
      {children}
    </div>
  );
}

export default AlertBanner;
