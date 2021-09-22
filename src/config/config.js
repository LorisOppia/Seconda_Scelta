export const url_codiceTestata =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8000/codiceTestata/'
    : `http://192.168.20.10:8000/codiceTestata/`

export const url_note =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8000/declassamento/'
    : `http://192.168.20.10:8000/declassamento/`

export const url_foto =
    process.env.NODE_ENV === 'development'
      ? 'http://127.0.0.1:8000/foto/'
      : `http://192.168.20.10:8000/foto/`

export const url_codiceArticolo =
    process.env.NODE_ENV === 'development'
      ? 'http://127.0.0.1:8000/codiceArticolo/'
      : `http://192.168.20.10:8000/codiceArticolo/`