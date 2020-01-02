const test = require('ava')
const parseLicense = require('./index.js').parseLicense

test('Should throw for non-commons-URLs', async t => {
  try {
    await parseLicense('https://eu.dl.twrp.me/beryllium/twrp-3.3.0-0-beryllium.img.html')
    t.fail()
  } catch (e) {
    t.is('File must be hosted on https://commons.wikimedia.org', e.message)
  }
})

test('Parsing CC-BY-SA 2.5', async t => {
  const license = await parseLicense('https://commons.wikimedia.org/wiki/File:Lak%C3%B3h%C3%A1z_(18303._sz%C3%A1m%C3%BA_m%C5%B1eml%C3%A9k).jpg')
  t.deepEqual({
    date: '2011-09-30',
    author: {
      name: 'ara501',
      href: 'http://indafoto.hu/ara501'
    },
    source: {
      name: 'Indafotó',
      href: 'http://indafoto.hu/ara501/image/13323665-eac38839'
    },
    license: {
      name: 'CC BY-SA 2.5 hu',
      href: 'https://creativecommons.org/licenses/by-sa/2.5/hu/deed.en'
    }
  }, license)
})
