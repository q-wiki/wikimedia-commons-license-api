const test = require('ava')
const parseLicense = require('./index.js').parseLicense

test('Throws an error for non-commons-URLs', async t => {
  try {
    await parseLicense('https://eu.dl.twrp.me/beryllium/twrp-3.3.0-0-beryllium.img.html')
    t.fail()
  } catch (e) {
    t.is('File must be hosted on https://commons.wikimedia.org', e.message)
  }
})

test('Parses CC-BY 2.0', async t => {
  const license = await parseLicense('https://commons.wikimedia.org/wiki/File:Night_in_Shengping_Theater_entry_20120407a.jpg')
  t.deepEqual({
    date: '2012-04-07 18:38:43',
    author: {
      href: null,
      label: 'neverbutterfly'
    },
    source: {
      href: 'https://www.flickr.com/photos/7451276@N08/7144848799',
      label: 'https://www.flickr.com/photos/7451276@N08/7144848799'
    },
    license: {
      href: 'https://creativecommons.org/licenses/by/2.0/deed.en',
      label: 'CC BY 2.0'
    }
  }, license)
})

test('Parses author without link', async t => {
  const license = await parseLicense('https://commons.wikimedia.org/wiki/File:Night_in_Shengping_Theater_entry_20120407a.jpg')
  t.deepEqual({
    href: null,
    label: 'neverbutterfly'
  }, license.author)
})

test('Parses CC-BY-SA 2.5', async t => {
  const license = await parseLicense('https://commons.wikimedia.org/wiki/File:Lak%C3%B3h%C3%A1z_(18303._sz%C3%A1m%C3%BA_m%C5%B1eml%C3%A9k).jpg')
  t.deepEqual({
    date: '2011-09-30',
    author: {
      label: 'ara501',
      href: 'http://indafoto.hu/ara501'
    },
    source: {
      label: 'Indafotó',
      href: 'http://indafoto.hu/ara501/image/13323665-eac38839'
    },
    license: {
      label: 'CC BY-SA 2.5 hu',
      href: 'https://creativecommons.org/licenses/by-sa/2.5/hu/deed.en'
    }
  }, license)
})

test('Parses CC-BY-SA 4.0', async t => {
  const license = await parseLicense('https://commons.wikimedia.org/wiki/File:%D0%A7%D0%B0%D1%81%D0%BE%D0%B2%D0%BD%D1%8F_%D0%BD%D0%B0%D0%B4_%D0%BC%D0%BE%D0%B3%D0%B8%D0%BB%D0%BE%D0%B9_%D0%BF%D0%B5%D0%B2%D0%B8%D1%86%D1%8B_%D0%90%D0%BD%D0%B0%D1%81%D1%82%D0%B0%D1%81%D0%B8%D0%B8_%D0%92%D1%8F%D0%BB%D1%8C%D1%86%D0%B5%D0%B2%D0%BE%D0%B9.jpg')
  t.deepEqual({
    date: '2019-07-10 18:52:18',
    author: {
      href: 'https://commons.wikimedia.org/w/index.php?title=User:Anastasia_Galyamicheva&action=edit&redlink=1',
      label: 'Anastasia Galyamicheva'
    },
    source: {
      href: null,
      label: 'Own work'
    },
    license: {
      label: 'CC BY-SA 4.0',
      href: 'https://creativecommons.org/licenses/by-sa/4.0/deed.en'
    }
  }, license)
})

test('Converts relative to absolute URLs', async t => {
  const license = await parseLicense('https://commons.wikimedia.org/wiki/File:%D0%A7%D0%B0%D1%81%D0%BE%D0%B2%D0%BD%D1%8F_%D0%BD%D0%B0%D0%B4_%D0%BC%D0%BE%D0%B3%D0%B8%D0%BB%D0%BE%D0%B9_%D0%BF%D0%B5%D0%B2%D0%B8%D1%86%D1%8B_%D0%90%D0%BD%D0%B0%D1%81%D1%82%D0%B0%D1%81%D0%B8%D0%B8_%D0%92%D1%8F%D0%BB%D1%8C%D1%86%D0%B5%D0%B2%D0%BE%D0%B9.jpg')
  t.true(/^https?:\/\//.test(license.author.href))
})
