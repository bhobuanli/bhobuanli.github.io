---
title: Nuxt 静态博客笔记
description: 用 Nuxt Content 和 GitHub Pages 发布文章的记录。
date: 2026-08-21
tags:
  - Nuxt
  - 前端
---

## 数据从哪里来

::x-post{url="https://x.com/swyx/status/1374492662061953034"}
::
::x-post{url="https://x.com/bhobuanli/status/1834916805024137323"}
::

文章放在 `content/posts`，Nuxt Content 会把 Markdown 转成可查询的数据。

```ts
const { data: posts } = await useAsyncData('posts', () =>
  queryCollection('content').all()
)
```

| 部分 | 作用 |
| --- | --- |
| Markdown | 写作内容 |
| Nuxt | 页面与构建 |
| Pages | 静态托管 |



[1]: x.com	"推特"

26526
