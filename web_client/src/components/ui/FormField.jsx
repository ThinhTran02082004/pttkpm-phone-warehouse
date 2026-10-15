function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  children,
}) {
  return (
    <div className="shell-field">
      <label htmlFor={id}>{label}</label>
      {children || (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

export default FormField;
