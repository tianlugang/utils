/**
 * 浏览器是否支持 ReadableStream
 */
const hasReadableStream = () => typeof Response !== 'undefined' && typeof ReadableStream !== 'undefined';

// 上传进度速度表
let getSpeedmeter = (seconds: number): (delta: number) => void => {
  var tick = 1;
  var maxTick = 65535;
  var resolution = 4;
  var inc = function () {
    tick = (tick + 1) & maxTick;
  };
  var timer = setInterval(inc, (1000 / resolution) | 0) as any;
  if (timer.unref) timer.unref();

  getSpeedmeter = (seconds: number) => {
    var size = resolution * (seconds || 5);
    var buffer = [0];
    var pointer = 1;
    var last = (tick - 1) & maxTick;

    return (delta: number) => {
      var dist = (tick - last) & maxTick;
      if (dist > size) dist = size;
      last = tick;

      while (dist--) {
        if (pointer === size) pointer = 0;
        buffer[pointer] = buffer[pointer === 0 ? size - 1 : pointer - 1];
        pointer++;
      }

      if (delta) buffer[pointer - 1] += delta;

      var top = buffer[pointer - 1];
      var btm = buffer.length < size ? 0 : buffer[pointer === size ? 0 : pointer];

      return buffer.length < resolution ? top : (top - btm) * resolution / buffer.length;
    };
  }

  return getSpeedmeter(seconds);
}

/**
 * 处理进度
 * @param {number} length 
 * @param {number} progressDelay 
 * @param {number} progress.percentage 下载百分比
 * @param {number} progress.transferred 已传输数据（单位byte）
 * @param {number} progress.length 数据总长度
 * @param {number} progress.remaining 剩余未下载
 * @param {number} progress.eta 预计剩余时间
 * @param {number} progress.runtime 已经消耗时间
 * @param {number} progress.delta 未知
 * @param {number} progress.speed 处理速度
 */
const createProgress = (length: number, progressDelay = 1000) => {
  return {
    length,
    transferred: 0,
    speed: 0, // 处理速度
    streamSpeed: getSpeedmeter(5000),
    initial: false,
    progressDelay: progressDelay,
    eventStart: 0,
    percentage: 0,
    getRemaining() {
      return parseInt(this.length, 10) - parseInt(this.transferred, 10);
    },
    getEta() {
      return this.length >= this.transferred ? this.getRemaining() / this.speed * 1000000000 : 0;
    },
    flow(chunk: Uint8Array, onProgress: IOnProgress) {
      const chunkLength = chunk.length;
      this.transferred += chunkLength;
      this.speed = this.streamSpeed(chunkLength);
      this.percentage = Math.round(this.transferred / this.length * 100);
      if (!this.initial) {
        this.eventStart = Date.now();
        this.initial = true;
      }

      if (this.length >= this.transferred || Date.now() - this.eventStart > this.progressDelay) {
        this.eventStart = Date.now();

        const progress = {
          length: this.length,
          transferred: this.transferred,
          speed: this.speed,
          eta: this.getEta(),
          percentage: 0,
          remaining: 0
        };
        if (this.length) {
          progress.remaining = this.getRemaining();
          progress.percentage = this.percentage;
        }

        onProgress(progress);
      }
    }
  }
}

type IOnProgress = {
  (psg: IProgress): void
}
type IProgress = {
  length: number
  transferred: number
  speed: number
  eta: number
  remaining: number
  percentage: number
}
// 下载进度处理
export function getDownloadProgress(onProgress: IOnProgress, contentLength: number, progressDelay: number) {
  return function (res: Response) {
    if (!hasReadableStream() || res.body == null) {
      return res;
    }

    const length = parseInt(res.headers.get('content-length') || contentLength.toString(10));
    const progress = createProgress(length, progressDelay);
    const reader = res.body.getReader();
    const stream = new ReadableStream({
      start(controller) {
        function push() {
          reader.read().then(({
            done,
            value
          }) => {
            if (done) {
              onProgress({
                length: progress.length,
                transferred: progress.transferred,
                speed: progress.speed,
                eta: progress.getEta(),
                remaining: progress.getRemaining(),
                percentage: progress.percentage
              });
              controller.close();
              return;
            }

            if (value) {
              progress.flow(value, onProgress);
            }
            controller.enqueue(value);
            push();
          })
          // .catch(onError);
        }

        push();
      },
    });

    return new Response(stream, res);
  }
}
