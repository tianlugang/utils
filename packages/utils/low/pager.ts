/**
 *
 * @name backendPager
 * @desc 重构分页函数的必要 ： 无法定位到列表页名称、逻辑缩水
 * @param {number} currPageNo 当前页码
 * @param {number} dataTotal 当前总页数
 * @param {object} options 传递给分页的配置函数
 * @example < 1 2 3 4 >
 * @example < 1 2 3 4 5 7 8 ... 13 >
 * @example < 1 ... 7 8 9 10 11 12 13 >
 * @example < 1 ... 5 6 7 8 9 ... 13 >
 * @desc url 模型： ./list_1.html
 * @desc url 模型： ./list1.html
 * @desc 规则 \w+(_-\s)\d+.html --> 与路由规则相同
 *
 * *******************************************************************************
 *
 * @desc 注意：当 options 对象的子级为对象时，需要将其转为字符串
 *            例如 options.query , 此处只支持字符串query
 *
 * *******************************************************************************
 **/
function backendPager(currPageNo, dataTotal, options) {
    currPageNo *= 1;
    dataTotal *= 1;
    if (isNaN(currPageNo) || isNaN(dataTotal)) {
        return '';
    }
    const usrOptions = typeof options === 'object' ? options : {};
    const sysOptions = {};

    sysOptions.locator = usrOptions.locator || 'list'; // -------------href名称
    sysOptions.sep = usrOptions.sep || '_'; // ------------------------href名称连接符
    sysOptions.suff = usrOptions.suff || '.html'; // ------------------href后缀名称
    sysOptions.query = usrOptions.query || ''; // ---------------------加给URL上的query
    sysOptions.show = usrOptions.show || 5; // ------------------------总显示几个页码，该值不大于总页码
    sysOptions.count = usrOptions.count || 50; // ---------------------每页多少条数据
    sysOptions.mode = usrOptions.mode || 2; // ------------------------当前页的位置， 3中模式: first(1: 首位) middle(2: 二分) last(3: 末尾)
    sysOptions.prestr = usrOptions.prestr || ''; // -------------------预设字符串，将于返回值相加
    sysOptions.hold = usrOptions.hold || '…'; // ----------------------空档占位符
    sysOptions.across = usrOptions.across || 'no more'; // ------------没有数据时的提示语句
    const maxPageNo = Math.ceil(dataTotal / sysOptions.count); // -----最大页码数
    const allowPageNo = sysOptions.show; // ---------------------------备份 sysOptions.show

    /**
	 * 获取URL
	 * @param {number} num 页码
	 */
    const getLocation = function (pageNo) {
        !pageNo && (pageNo = 1);
        const query = sysOptions.query ? '?' + sysOptions.query : '';

        return sysOptions.locator + sysOptions.sep + pageNo + sysOptions.suff + query;
    };

    /**
	 * 获取上一页
	 * @param {number} prevPageNo 页码
	 */
    const getPrevPage = function (prevPageNo) {
        if (currPageNo > 2) {
            prevPageNo = currPageNo - 1;
            if (currPageNo > maxPageNo) {
                prevPageNo = 1;
            }

            return `<a class="prev" href="${getLocation(prevPageNo)}" target="_self"><i class="ift-prev"></i></a>`;
        }

        return '<span class="prev"><i class="ift-prev"></i></span>';
    };

    /**
	 * 获取下一页
	 */
    const getNextPage = function () {
        if (currPageNo < maxPageNo) {
            return `<a class="next" href="${getLocation(currPageNo + 1)}" target="_self"><i class="ift-next"></i></a>`;
        }

        return '<span class="next"><i class="ift-next"></i></span>';
    };

    const getPagelist = function () {

        // 当前页大于最大页时，直接返回用户提供的across文本
        if (currPageNo > maxPageNo) {
            return sysOptions.across;
        }

        // 总页数小于等于opts.show , 依次显示
        let pagestr = ''; // ------------------------------------ 页面文本字符串
        let loopStart = 1; // ----------------------------------- 本次页码起始值
        let loopEnd = maxPageNo; // ----------------------------- 本次页码结束值
        const distancieFirst = currPageNo; // ------------------- 当前页到首页的距离
        const distancieLast = ~(currPageNo - maxPageNo) + 1; // - 当前页到尾页的距离

        if (maxPageNo - allowPageNo > 2) {

            // 通用
            if (distancieLast < allowPageNo) {
                loopStart = maxPageNo - allowPageNo;
                loopEnd = maxPageNo;
            } else if (distancieFirst < allowPageNo) {
                loopStart = 1;
                loopEnd = allowPageNo;
            } else {

                // 最大页码 与 allowPageNo 的距离
                switch (sysOptions.mode) {
                    case 1:
                        // 首位
                        loopStart = currPageNo - 1;
                        loopEnd = loopStart + allowPageNo;
                        break;
                    case 2:
                        // 二分
                        /* eslint no-case-declarations : off */
                        let median = ~~(allowPageNo / 2); // ----------- 用户需要展示的页码的个数的中值

                        allowPageNo % 2 === 0 && --median; // ---------- 当用户需要展示的页码的个数为偶数时，中值减1
                        const distanceMedian = currPageNo - median; // --- 当前页到中值的距离

                        if (distanceMedian < 1) {
                            loopStart = currPageNo;
                            loopEnd = currPageNo + (~distanceMedian + 1);
                        } else {
                            loopStart = distanceMedian;
                            loopEnd = currPageNo + median;
                        }
                        break;
                    case 3:
                        // 靠近末尾
                        const distanceAllow = currPageNo - allowPageNo;

                        loopStart = (distanceAllow <= 1 ? 1 : distanceAllow) + 1;
                        loopEnd = currPageNo + 1;
                        break;
                    default:
                        break;
                }
            }
        }

        // 当前页到首页的距离
        if (distancieFirst >= allowPageNo) {
            pagestr += `<a href="${getLocation()}" target="_self">1</a>` + sysOptions.hold;
        }

        for (let i = loopStart; i <= loopEnd; i++) {
            if (i === currPageNo) {
                pagestr += `<span class="active">${i}</span>`;
            } else {
                pagestr += `<a href="${getLocation(i)}" target="_self">${i}</a>`;
            }
        }

        // 当前页到尾页的距离
        if (distancieLast >= allowPageNo) {
            pagestr += sysOptions.hold + `<a href="${getLocation(maxPageNo)}" target="_self">${maxPageNo}</a>`;
        }

        return pagestr;
    };

    return `${sysOptions.prestr}${getPrevPage()}${getPagelist()}${getNextPage()}`;
}

module.exports = backendPager;