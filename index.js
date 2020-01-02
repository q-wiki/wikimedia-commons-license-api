// server config is done via environment variables, we provide defaults
const {
  PORT = 3000
} = process.env

const { URL } = require('url')
const polka = require('polka') // http server
const axios = require('axios') // http client
const cheerio = require('cheerio')

const wikimediaCommonsUrl = /^https?:\/\/commons.wikimedia.org/


/**
 * Given a wikimedia commons URL, returns an object describing the license in
 * a structured format.
 *
 * @return Object
 */
async function parseLicense (url) {
  if (!wikimediaCommonsUrl.test(url)) {
    throw new Error('File must be hosted on https://commons.wikimedia.org')
  }

  const res = await axios.get(url)
  const $ = cheerio.load(res.data)

  const absoluteUrl = href => href == null ? null : (new URL(href, url)).href

  // Remove empty strings to make it clear that the emptiness is intentional
  const removeEmpty = str => str === '' ? null : str

  // Helper to extract information from a wikimedia commons page; the data is
  // identified with different classes and IDs which we can use to traverse the
  // DOM and extract it. Sometimes the data is given as simple text, sometimes
  // it's a link where the target URL is also of interest
  const extractFromNode = node => {
    const link = node.find('a')
    if (link.length) {
      return {
        label: removeEmpty(link.text().trim()),
        href: removeEmpty(absoluteUrl(link.attr('href')))
      }
    } else {
      return {
        href: null,
        label: node.text().trim()
      }
    }
  }

  // the information about which ID contains what is taken from
  // https://commons.wikimedia.org/wiki/Commons:Machine-readable_data#Machine_readable_data_set_by_infobox_templates
  const authorNode = $('#fileinfotpl_aut + td')
  const author = extractFromNode(authorNode)

  const sourceNode = $('#fileinfotpl_src + td')
  const source = extractFromNode(sourceNode)

  const date = $('#fileinfotpl_date + td time').attr('datetime')

  // TODO: #fileinfotpl_perm
  let license = null
  const permNode = $('#fileinfotpl_perm')
  if (permNode.length) {
    throw new Error('Permissions via #fileinfotpl_perm not implemented!')
  } else {
    const englishLicense = href => href.replace(/\/deed.(\w+)$/, '') + '/deed.en'

    license = {
      href: englishLicense($('.licensetpl_link').text().trim()),
      label: $('.licensetpl_short').text().trim()
    }
  }

  return { source, author, date, license }
}

const server = polka()
  .get('/license', async (req, res) => {
    try {
      const parsed = await parseLicense(req.query.commonsUrl)
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=UTF-8'
      })
      res.end(JSON.stringify(parsed))
    } catch (e) {
      res.writeHead(400, {
        'Content-Type': 'text/plain; charset=UTF-8'
      })
      res.end('🔥 ' + e.message)
    }
  })

if (module.parent == null) {
  // this means we're run directly from the command line!
  server.listen(PORT, err => {
    if (err) throw err
    console.log('Server started on port ' + PORT)
  })
} else {
  module.exports = {
    parseLicense, server
  }
}
