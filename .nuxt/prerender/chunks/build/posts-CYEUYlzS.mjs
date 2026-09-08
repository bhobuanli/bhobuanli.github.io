import { N as NuxtLink } from '../virtual/entry.mjs';
import { u as useAsyncData, q as queryCollection } from './client-CtHyGUlj.mjs';
import { defineComponent, withAsyncContext, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'file://D:/development/my-blog/node_modules/vue/index.mjs';
import { ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'file://D:/development/my-blog/node_modules/vue/server-renderer/index.mjs';
import 'file://D:/development/my-blog/node_modules/nostics/dist/index.mjs';
import 'file://D:/development/my-blog/node_modules/nostics/dist/formatters/ansi.mjs';
import 'file://D:/development/my-blog/node_modules/nuxt/node_modules/hookable/dist/index.mjs';
import 'file://D:/development/my-blog/node_modules/unctx/dist/index.mjs';
import 'file://D:/development/my-blog/node_modules/h3/dist/index.mjs';
import 'file://D:/development/my-blog/node_modules/ufo/dist/index.mjs';
import 'file://D:/development/my-blog/node_modules/ofetch/dist/node.mjs';
import '../_/nitro.mjs';
import 'file://D:/development/my-blog/node_modules/destr/dist/index.mjs';
import 'file://D:/development/my-blog/node_modules/hookable/dist/index.mjs';
import 'file://D:/development/my-blog/node_modules/node-mock-http/dist/index.mjs';
import 'file://D:/development/my-blog/node_modules/klona/dist/index.mjs';
import 'file://D:/development/my-blog/node_modules/defu/dist/defu.mjs';
import 'file://D:/development/my-blog/node_modules/scule/dist/index.mjs';
import 'file://D:/development/my-blog/node_modules/radix3/dist/index.mjs';
import 'node:fs';
import 'node:url';
import 'file://D:/development/my-blog/node_modules/pathe/dist/index.mjs';
import 'file://D:/development/my-blog/node_modules/unstorage/dist/index.mjs';
import 'file://D:/development/my-blog/node_modules/unstorage/drivers/fs.mjs';
import 'file:///D:/development/my-blog/node_modules/@nuxt/nitro-server/dist/runtime/utils/cache-driver.mjs';
import 'file://D:/development/my-blog/node_modules/unstorage/drivers/fs-lite.mjs';
import 'file://D:/development/my-blog/node_modules/db0/dist/connectors/better-sqlite3.mjs';
import 'file://D:/development/my-blog/node_modules/ohash/dist/index.mjs';
import 'file://D:/development/my-blog/node_modules/vue-router/vue-router.node.mjs';
import 'file://D:/development/my-blog/node_modules/unhead/dist/utils.mjs';
import '../_/renderer.mjs';
import 'node:async_hooks';
import 'file://D:/development/my-blog/node_modules/unhead/dist/server.mjs';
import 'file://D:/development/my-blog/node_modules/unhead/dist/legacy.mjs';
import 'file://D:/development/my-blog/node_modules/unhead/dist/plugins.mjs';
import 'file://D:/development/my-blog/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import 'file://D:/development/my-blog/node_modules/devalue/index.js';

var index_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: posts } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("posts", () => queryCollection("content").where("path", "LIKE", "/posts/%").order("date", "DESC").all())), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = NuxtLink;
      _push(`<!--[--><section class="page-intro"><p class="eyebrow">WRITING</p><h1>\u6587\u7AE0</h1><p class="lead">\u8BB0\u5F55\u6B63\u5728\u5B66\u4E60\u7684\u4E8B\uFF0C\u4E5F\u8BB0\u5F55\u8FD8\u6CA1\u6709\u7B54\u6848\u7684\u95EE\u9898\u3002</p></section><div class="post-list"><!--[-->`);
      ssrRenderList(unref(posts), (post) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: post.path,
          to: post.path,
          class: "post-card"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) _push2(`<span${_scopeId}>${ssrInterpolate(post.date)}</span><h2${_scopeId}>${ssrInterpolate(post.title)}</h2><p${_scopeId}>${ssrInterpolate(post.description)}</p>`);
            else return [
              createVNode("span", null, toDisplayString(post.date), 1),
              createVNode("h2", null, toDisplayString(post.title), 1),
              createVNode("p", null, toDisplayString(post.description), 1)
            ];
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><!--]-->`);
    };
  }
});
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/posts/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var posts_default = index_vue_vue_type_script_setup_true_lang_default;

export { posts_default as default };
//# sourceMappingURL=posts-CYEUYlzS.mjs.map
