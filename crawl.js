import {JSDOM} from 'jsdom';

function normalizeURL(url) {
    const urlObj = new URL(url)
    let fullPath = `${urlObj.host}${urlObj.pathname}`
    if (fullPath.slice(-1) === '/') {
      fullPath = fullPath.slice(0, -1)
    }
    return fullPath
}

function isNumber(value) {
  return typeof value === 'number';
}

function getURLsFromHTML(htmlBody, baseURL) {
  if(isNumber(htmlBody) || isNumber(baseURL)) return [];
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const anchors = dom.window.document.querySelectorAll('a');

  for(const anchor of anchors) {
    if(anchor.hasAttribute('href')) {
      let href = anchor.getAttribute('href');
      try {
        // convert relative url to absolute
        href = new URL(href, baseURL).href;
        urls.push(href)
      } catch(err) {
        console.log(`${err.message}: ${href}`);
      }
    }
  }

  return urls;
}

async function fetchHTML(url) {
  let res
  try {
    res = await fetch(url)
  } catch (err) {
    throw new Error(`Got Network error: ${err.message}`)
  }

  if (res.status > 399) {
    throw new Error(`Got HTTP error: ${res.status} ${res.statusText}`)
  }

  const contentType = res.headers.get('content-type')
  if (!contentType || !contentType.includes('text/html')) {
    throw new Error(`Got non-HTML response: ${contentType}`)
  }

  return res.text()
}

async function crawlPage(baseURL, currentURL = baseURL, pages = {}) {
  
    const baseDomain = new URL(baseURL);
    const currentDomain = new URL(currentURL);
    if(baseDomain.hostname !== currentDomain.hostname) return pages;

    const normalisedCurrent = normalizeURL(currentURL);
    if(pages[normalisedCurrent] > 0){
      pages[normalisedCurrent]++;
      return pages;
    }

    pages[normalisedCurrent] = 1

    let html = ''
    try {
      html = await fetchHTML(currentURL);
    } catch(err) {
      console.log(`${err.message}`);
      return pages;
    }

    const nextURLs = getURLsFromHTML(html, baseURL);
    for(const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages);
    }

    return pages;
}


export {normalizeURL, getURLsFromHTML, crawlPage};