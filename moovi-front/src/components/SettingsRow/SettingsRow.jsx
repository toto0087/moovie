import styles from './SettingsRow.module.css';

export function SettingsRow({
  label,
  description,
  children,
  onClick,
  as: Tag = onClick ? 'button' : 'div',
  ...rest
}) {
  return (
    <Tag
      type={Tag === 'button' ? 'button' : undefined}
      className={`${styles.row} ${onClick ? styles.clickable : ''}`}
      onClick={onClick}
      {...rest}
    >
      <div className={styles.text}>
        <span className={styles.label}>{label}</span>
        {description && <span className={styles.description}>{description}</span>}
      </div>
      {children && <div className={styles.control}>{children}</div>}
    </Tag>
  );
}
