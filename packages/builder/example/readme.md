# @tlg/mock

用于前端开发时`fake`数据

**Install**
```sh
    npm install -D @tlg/mock
```

**Usage**
---
暂无文档

**Example**
```js
    const { Action } = require('@tlg/mock')
    const { Random } = require('mockjs')

    module.exports = class Example extends Action {
        constructor(router, app) {
            super(router, app)

            this.router.get('/demo/list', this.list.bind(this))
        }

        /**
         * @param {string} name: 模板名称关键词
         * @param {number} page: 显示页
         * @param {number} pageSize: 每页显示数量
         */
        list(req, res) {
            const {
            name,
            page,
            pageSize
            } = req.query
            const list = []

            const totalCount = 100
            const pageCount = Math.ceil(totalCount / pageSize)
            const max = page * pageSize
            const start = max - pageSize
            const limit = max > totalCount ? totalCount : max

            for (let i = start; i < limit; i++) {
                list.push({
                    id: i,
                    type: 'from',
                    name: Random.cparagraph(5, 8),
                    file_url: Random.url(),
                    is_shared: Random.boolean(),
                    created_at: '2020-08-11 15:20:01',
                    can_shared: Random.boolean(),
                    can_delete: Random.boolean(),
                    can_edit: Random.boolean(),
                    can_copy: false,
                    can_download: false
                })
            }

            const body = {
                list,
                page: {
                    totalCount, // 记录总数量，整数类型
                    pageCount, // 总页数，整数类型
                    perPage: pageSize, // 每页显示数量，整数类型
                    currentPage: page // 当前页码，整数类型
                }
            }

            res.status(200)
            res.json(body)
        }


        /**
         * 模板分享 id
         * @param id
         */
        share(req, res) {
            const templateId = this.getPropsFromRequestBody(req.body, 'id')

            res.status(200)
            if (templateId > 0) {
                res.json(this.relay([], 1))
                return
            }

            res.json(this.relay(null, 0, '模板id不存在'))
        }
    }

```
