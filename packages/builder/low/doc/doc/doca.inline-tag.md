
# 内联标签

- @link

  - 定义一个链接, 可链接到由`@name`定义的`namepath`(锚点)或一个指定的 URL
  - 语法 `text`{@link namepathOrURL}
  - 例如：

  ```js
  /**
   * @name Login#submit
   */

  /**
   * @desc 如果你还不清楚登录的逻辑，请点击`此处`{@link Login#submit}
   */
  ```

- @text

  - 定义一段文本, 可通过设置`attr`改变文本样式
  - 语法 `text`{@text attr}
  - 例如:
    ```js
    /**
     * @desc 这是`用户登录`{@text info}流程的体现
     */
    ```

- @source
  - 定义一个外链资源，如图片、视频、音频、iframe 内嵌页等, 外链资源如果是块元素，将折行到新行，然后水平居中展示在其父容器中
  - 语法 `text`{@source attr}(URL)
  - 例如:
    ```js
    /**
     * @desc 如果你还不清楚流程，请看`此教程 `{@source [video]}(http://somedomain/pathname.mp3)
     */
    ```