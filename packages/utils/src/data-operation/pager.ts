export namespace Pager {
  export function limit(pageNo: number = 1, pageSize: number = 10) {
    pageNo = pageNo >= 1 ? pageNo : 1;
    pageSize = pageSize > 0 ? pageSize : 10;

    return [pageSize * (pageNo - 1), pageSize];
  }
}
