import styles from './style.module.css'

const ContentA = function ({As = "div", children, className, ...prop}) {
  return (
    <As {...prop} className={[styles.element, className, 'rounded-3 bg-light border border-1 shadow-sm mh-100 overflow-auto'].join(" ")}>
      {children}
    </As>
  )
}

export default ContentA;