import {stringify as stringifyLinks} from 'http-header-link'

export default function (req, res, next) {
  res.links = function links (linkObj, lang = false) {
    if (typeof linkObj !== 'object') {
      throw new Error('res.links expects linkObj to be an object')
    }

    if (linkObj instanceof Promise) {
      if (lang instanceof Promise) {
        return Promise.all([linkObj, lang]).then(args => this.links(...args))
      }
      return linkObj.then(linkObj => this.links(linkObj, lang))
    }
    if (lang instanceof Promise) {
      return lang.then(lang => this.links(linkObj, lang))
    }

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
