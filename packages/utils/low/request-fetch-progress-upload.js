'use strict';
//
// fetch目前不支持上传进度处理，相关替代的API的兼容性很差，因此此方案备份
// /////////////////////////////////////////
// /////////////////////////////////////////
// 
function fetchUploadProgress(action, option, config) {
  if (!config.contentLength) {
    return fetch(action, option);
  }
  const progress = {
    length: config.contentLength, // 文件总长度
    transferred: 0, // 已发送
    runtime: Date.now(), // 已耗时
    percentage: 0, // 已上传的占比
    speed: Math.floor(config.contentLength / 50), // 进度条的进度值
  };
  const onProgress = function (isDone) {
    progress.transferred = isDone ? progress.length : (progress.transferred + progress.speed);
    progress.runtime = Date.now() - progress.runtime;
    progress.percentage = (progress.transferred / progress.length).toFixed(4) * 100;
    config.onProgress(progress);
  };
  const request = new Request(action, option);
  const uploadProgress = new ReadableStream({
    start(controller) {
      onProgress();
      controller.enqueue(request.bodyUsed);
    },
    pull(controller) {
      onProgress();
      if (request.bodyUsed) {
        controller.close();
      }
      controller.enqueue(request.bodyUsed);
    },
    cancel( /*reason*/ ) {
      onProgress();
    },
  });
  const fileUpload = fetch(request).catch(err => {
    reader.cancel();
    config.onError(err);
    throw err;
  });
  const reader = uploadProgress.getReader();
  const processUploadRequest = ({
    value,
    done
  }) => {
    onProgress();
    if (value || done) {
      return reader.closed.then(() => fileUpload);
    }
    return reader.read().then(result => processUploadRequest(result));
  };

  return reader.read()
    .then(({
      value,
      done
    }) => processUploadRequest({
      value,
      done
    }))
    .then(res => {
      onProgress(true);
      return res;
    });
}

module.exports = fetchUploadProgress;
