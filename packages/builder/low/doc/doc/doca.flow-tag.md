# 流程块标签

* @section

  + 定义: 声明一个逻辑块，可搭配 `@step` 或者 `@title` 实现一个代码块，直到遇到 `@section` 结束
  + 语法: `@section {PathLink} name - desc` 
  + 例如：见标签 `@step` 案例

* @title

  + 定义: 声明逻辑块的标题, 可在 `@section` 逻辑块中开启子逻辑块，直到遇到新的同级 `@title` 结束，或者 `@section` 结束
  + 语法: `@title {size<1~6>} desc ...` 
  + 例如: 见标签 `@step` 案例

* @step

  + 定义: 声明一个逻辑步骤，可生成跳转到源码指定位置的链接
  + 语法: `@step [serial-number] - desc` 
  + 例如:

``` js
    /**
     * @section {Login} submit -
     * @title {2} 用户登录提交
     */
    function submit() {
        // @step 1. 登录表单字段提取
        const fields = Login.getFromFields();
        // @step 2. 必须字段校验
        const result = Login.validation(fields);
        // @step 3. 校验结果处理, 如果校验失败，给予用户相应的提示， 校验成功时，执行通过
        if (result) {
            return Login.throw(result);
        }
        // @step 4 所有必须字段校验成功，直接提交
        Login.push(fields)
            .then(res => {
                if (res.status !== 200) {
                    // @step 4.1 服务器端校验失败，则传递一个异常
                    throw Common.expection("Login", "submit", res); // res = {code:number, message: string}
                }
                // @step 4.2 登录成功，本地化相应的用户登录数据并跳转到要登录的页面
                Login.localize(fields, res.data);
                Common.router.go();
            })
            .catch(error => {
                Login.throw(error);
            });
    }
```

    上面的案例描述一个登录表单提交的逻辑

