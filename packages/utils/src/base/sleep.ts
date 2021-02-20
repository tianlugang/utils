/**
 * 延时执行
 * 比如 sleep(1000) 意味着等待1000毫秒，还可从 Promise、Generator、Async/Await 等角度实现。
 *@example
 *  sleep(1000).then(() => {
 *    console.log(123);
 *  });
 * 
 *  // 使用 async / await 实现
 *  const asyncSleep = async function asyncSleep(time){
 *      return await new Promise(resolve => setTimeout(resolve, time))
 *  }
 *  ;(async function(){
 *      console.log('sleep 3s');
 *      await asyncSleep(3000);
 *      console.log('sleep end.');
 *  })();
 * 
 *  // 使用 Generator 实现
 *  const sleepGenerator = function* sleepGenerator(time) {
 *     yield new Promise(function (resolve, reject) {
 *          setTimeout(resolve, time);
 *     });
 *  }
 *  sleepGenerator(1000)
 *     .next()
 *     .value.then(() => {
 *         console.log(1);
 *     });
 * 
 *  // 使用 callback 实现
 *  const sleepTimeout = function sleepTimeout(callback, time) {
 *     if (typeof callback === "function") {
 *         setTimeout(callback, time);
 *     }
 *  }
 *  sleepTimeout(function (){ console.log('timeout delay ...') }, 1000);
 */
export namespace Sleep {
  export function promise(time: number = 0) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  export function whiled(time: number = 0) {
    var timeStart = Date.now()
    while (true) {
      if (timeStart + time >= Date.now()) {
        break
      }
    }
  }
}
