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

test('Parses CC0 1.0', async t => {
  const license = await parseLicense('https://commons.wikimedia.org/wiki/File:Fukuzawa_Yukichi_grave_-_Zenpukuji_-_Minato,_Tokyo_-_DSC06820.JPG')
  t.deepEqual({
    date: '2015-02-19 20:06:54',
    author: {
      href: 'https://commons.wikimedia.org/wiki/User:Daderot',
      label: 'Daderot'
    },
    source: {
      href: null,
      label: 'Own work'
    },
    license: {
      href: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
      label: 'CC0'
    }
  }, license)
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

test('Parses CC-BY 3.0', async t => {
  const license = await parseLicense('https://commons.wikimedia.org/wiki/File:Warszawskie,_Krak%C3%B3w,_Poland_-_panoramio_(127).jpg')
  t.deepEqual({
    date: '2014-04-04',
    author: {
      href: 'https://web.archive.org/web/20161028173306/http://www.panoramio.com/user/668831?with_photo_id=105250627',
      label: 'marek7400'
    },
    source: {
      href: 'https://web.archive.org/web/20161028173304/http://www.panoramio.com/photo/105250627',
      label: 'https://web.archive.org/web/20161028173304/http://www.panoramio.com/photo/105250627'
    },
    license: {
      href: 'https://creativecommons.org/licenses/by/3.0/deed.en',
      label: 'CC BY 3.0'
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

test('Parses authors with multiple links', async t => {
  const license = await parseLicense('https://commons.wikimedia.org/wiki/File:Puesta_de_sol,_Tok,_Alaska,_Estados_Unidos,_2017-08-28,_DD_189-191_HDR.jpg')
  t.deepEqual({
    href: 'https://www.wikidata.org/wiki/Q28147777',
    label: 'Diego Delso'
  }, license.author)
})

test('Converts relative to absolute URLs', async t => {
  const license = await parseLicense('https://commons.wikimedia.org/wiki/File:%D0%A7%D0%B0%D1%81%D0%BE%D0%B2%D0%BD%D1%8F_%D0%BD%D0%B0%D0%B4_%D0%BC%D0%BE%D0%B3%D0%B8%D0%BB%D0%BE%D0%B9_%D0%BF%D0%B5%D0%B2%D0%B8%D1%86%D1%8B_%D0%90%D0%BD%D0%B0%D1%81%D1%82%D0%B0%D1%81%D0%B8%D0%B8_%D0%92%D1%8F%D0%BB%D1%8C%D1%86%D0%B5%D0%B2%D0%BE%D0%B9.jpg')
  t.true(/^https?:\/\//.test(license.author.href))
})

test('Parses files in the public domain, case #1', async t => {
  const license = await parseLicense('https://commons.wikimedia.org/wiki/File:Gesammelte_Werke_(Thoma)_1_071.jpg')
  t.deepEqual({
    date: null,
    author: {
      href: 'https://en.wikisource.org/wiki/de:Ludwig_Thoma',
      label: 'Ludwig Thoma'
    },
    source: {
      href: 'https://books.google.com/books?id=E9pLAAAAMAAJ',
      label: 'Google Books-USA'
    },
    license: {
      href: null,
      label: 'Public domain'
    }
  }, license)
})

test('Parses files in the public domain, case #2', async t => {
  const license = await parseLicense('https://commons.wikimedia.org/wiki/File:Sparta_Week_2014_140617-A-ZD229-731.jpg')
  t.deepEqual({
    date: '2014-06-17',
    author: {
      href: null,
      label: 'Sgt. Eric-James Estrada'
    },
    source: {
      href: 'https://www.dvidshub.net/image/1405691/sparta-week-2014',
      label: 'https://www.dvidshub.net/image/1405691/sparta-week-2014'
    },
    license: {
      href: null,
      label: 'Public domain'
    }
  }, license)
})

test('Parses files in the public domain in Germany', async t => {
  const license = await parseLicense('https://commons.wikimedia.org/wiki/File:Wappen_Niederseelbach.png')
  t.deepEqual({
    date: '1974-03-08',
    author: {
      label: 'Heinz Ritt',
      href: 'https://www.wikidata.org/wiki/Q1600820'
    },
    source: {
      href: 'http://www.ngw.nl/int/dld/n/niederseelbach.htm',
      label: 'http://www.ngw.nl/int/dld/n/niederseelbach.htm',
    },
    license: {
      href: null,
      label: 'Public domain'
    }
  }, license)
})
