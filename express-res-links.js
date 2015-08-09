import {stringify as stringifyLinks} from 'http-header-link'

export default function (req, res, next) {
  res.links = function links (linkObj, lang = false) {
    let val = this.get('Link') || ''
    lang = lang || this.get('Content-Language') || linkObj.defaultLang

    const newLinks = stringifyLinks(linkObj, lang)

    if (val) {
      val = val.trim()

      if (newLinks) {
        val += ', '
      }
    }
    val += newLinks

    this.set('Link', val)
  }

  next()
}
