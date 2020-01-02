// server config is done via environment variables, we provide defaults
const {
  PORT = 3000
} = process.env

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

  // the information about which ID contains what is taken from
  // https://commons.wikimedia.org/wiki/Commons:Machine-readable_data#Machine_readable_data_set_by_infobox_templates
  const authorNode = $('#fileinfotpl_aut + td a')
  const author = {
    name: authorNode.text(),
    href: authorNode.attr('href')
  }

  const sourceNode = $('#fileinfotpl_src + td a')
  const source = {
    name: sourceNode.text(),
    href: sourceNode.attr('href')
  }

  const date = $('#fileinfotpl_date + td time').attr('datetime')

  // TODO: #fileinfotpl_perm
  let license = null
  const permNode = $('#fileinfotpl_perm')
  if (permNode.length) {
    throw new Error('Permissions via #fileinfotpl_perm not implemented!')
  } else {
    license = {
      href: $('.licensetpl_link').text().trim(),
      name: $('.licensetpl_short').text().trim()
    }
  }

  return { source, author, date, license }
}

const server = polka()
  .get('/license/:commonsUrl', async (req, res) => {
    const parsed = parseLicense(req.params.commonsUrl)

    res.writeHead(200, {
      'Content-Type': 'application/json'
    })
    res.end(JSON.stringify(parsed))
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
