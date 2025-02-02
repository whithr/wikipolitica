import styles from './kofi.module.css'

export const KofiModal = ({ isMobile = false }) => {
  return (
    <iframe
      id='kofiframe'
      src='https://ko-fi.com/haleywhitman/?hidefeed=true&widget=true&embed=true&preview=true'
      style={{
        border: 'none',
        width: '100%',
        // On mobile, have the iframe fill its container,
        // on desktop use a fixed height (adjust as needed)
        height: isMobile ? '80dvh' : '600px',
        padding: '4px',
        boxShadow: 'none',
        borderRadius: '0',
        paddingTop: '8px',
        backgroundColor: 'red !important',
      }}
      className={styles.kofi}
      title='haleywhitman'
    />
  )
}
