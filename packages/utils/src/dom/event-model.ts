export const createEventModel = <T, D = any>(event: T & Event, emitted: boolean = false, data?: D) => {
  const model = {
    // IE模型中event是一个全局唯一的对象绑定在window对象上
    originalEvent: event ? event : window.event, // 原生事件模型
    type: event.type, // 事件对象类型
    target: event.target || event.srcElement,// 事件发生目标
    data: data, // 事件模型携带的数据
    timestamp: event.timeStamp || new Date().getTime(), // 事件发生时间
    emitted: emitted, // 事件是否自动触发
    // 阻止默认事件
    preventDefault() {
      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }
    },

    // 阻止冒泡
    stopPropagation() {
      if (event.stopPropagation) {
        event.stopPropagation();
      } else {
        event.cancelBubble = true;
      }
    },

    // 事件取消
    cancelEvent() {
      model.preventDefault();
      model.stopPropagation();
    }
  };

  return model;
}
