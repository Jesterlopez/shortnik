import { useRef, useState, useEffect } from "react"
import styles from '../styles/Form.module.css'
import { checkFormattUrl } from "../utils/checkFormattUrl"
import { IconCopy, Loader } from "../utils/icons"

const HOST = process.env.HOST_NAME_PROD || 'http://localhost:3000/'

export const FormShortLink = () => {
  const inputRef = useRef(null)
  const [shortURL, setShortURL] = useState('')
  const [error, setError] = useState(false)
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleSubmit = (e) => {
    e.preventDefault()
    const url = inputRef.current.value

    if( checkFormattUrl(url) ) {

        setError(false)
        setLoading(true)
        fetch('/api/shortUrl', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ url })
        })
        .then(res => res.json())
        .then(data => {
          setShortURL(`${HOST}${data.shortUrl}`)
          inputRef.current.value = ''
          setLoading(false)
        })

      }else {
        setError(true)
      }
      
  }

  const handleCopy = (e) => {
    e.preventDefault()

    if (shortURL !== '') {

      if (!navigator.clipboard) {
        console.log('Clipboard API not available')
        return;
      } else {

        navigator.clipboard.writeText(shortURL)
          .then(() => {
            setCopied(!copied)
            setTimeout(() => {
              setCopied(false)
            }, 3000)
          })
          .catch(err => {
            console.log('Something went wrong', err);
          })

      }

    }
  }

  return (
    <form className={styles.form}>
      {
        loading &&  
        <span className={styles.loading}>
          <Loader />
        </span>
      }
      <input ref={inputRef} type="text" placeholder="URL a acortar" className={styles.input} />
      <button type="submit" className={styles.button} onClick={handleSubmit}>
        Short Link
      </button>
      {
        error && 
        <div className={styles.messageError}>
          Please enter a valid URL
        </div>
      }
      {
        shortURL &&
        <span className={styles.shortLink}>
          <a href={ shortURL }>
            { shortURL }
          </a>
          <button onClick={ handleCopy } className={styles.copy}>
            { copied 
            ? 'Copied!' 
            : <IconCopy />
            }

          </button>
        </span>
      }
    </form>
  )
}