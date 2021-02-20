'use strict';

/**
 * 分页函数
 * @param {*} thisPage 
 * @param {*} pageCount 
 * @param {*} href 
 * @param {*} htmlpre 
 * @param {*} limitNum 
 */
function showpager(thisPage, pageCount, href, htmlpre, limitNum) {
  limitNum = limitNum || 5;
  thisPage = utils.toInt(thisPage);
  pageCount = utils.toInt(pageCount);
  href = href || '';

  // 链接格式，首页链接
  let hrefformat,
    firstpage = href.replace(/_p(\d+|all)\.html/gi, '.html').replace('index.html', '');

  // 首页url为/结尾的情况
  if (!firstpage) {
    firstpage = './';
  }

  if (/_p(\d+|all)\.html/gi.test(href)) {
    hrefformat = href.replace(/_p(\d+|all)\.html/gi, '_p{0}.html');
  } else if (href.indexOf('.html') != -1) {
    hrefformat = href.replace('.html', '_p{0}.html');
  } else {
    hrefformat = 'index_p{0}.html';
  }

  const getHref = function (page) {
    return page == 1 ? firstpage : hrefformat.format(page);
  };

  const comparePage = function (thispage, p) {
    let str = '';

    if (thisPage !== p) {
      if (p === 1 && thisPage <= 1) {
        str += `<span class="active">${p}</span>`;
      } else {
        str += `<a href="${getHref(p)}">${p}</a>`;
      }
    } else {
      str += `<span class="active">${p}</span>`;
    }

    return str;
  };

  let str = htmlpre || '';
  let p = 1;

  if (thisPage > 1) {
    str += `<a class="prev" href="${getHref(thisPage - 1)}"><i class="ift-prev"></i></a>`;
  } else {
    str += '<span class="prev"><i class="ift-prev"></i></span>';
  }

  if (pageCount < limitNum * 2) {
    for (p = 1; p <= pageCount; p++) {
      str += comparePage(thisPage, p);
    }
  } else {
    str += comparePage(thisPage, 1);

    if (thisPage <= limitNum) {
      for (p = 2; p <= limitNum + 2; p++) {
        str += comparePage(thisPage, p);
      }
      str += '…';
    } else {
      str += '…';
      if (thisPage <= pageCount - limitNum) {
        for (p = thisPage - 2; p <= thisPage + 2; p++) {
          str += comparePage(thisPage, p);
        }
      } else {
        for (p = pageCount - (limitNum + 1); p <= pageCount - 1; p++) {
          str += comparePage(thisPage, p);
        }
      }
      if (thisPage + Math.ceil(limitNum / 2) < pageCount - 1) {
        str += '…';
      }
    }
    str += comparePage(thisPage, pageCount);
  }

  if (thisPage < pageCount) {
    str += `<a class="next" href="${getHref(thisPage + 1)}"><i class="ift-next"></i></a>`;
  } else {
    str += '<span class="next"><i class="ift-next"></i></span>';
  }

  return str;
}

module.exports = showpager;
