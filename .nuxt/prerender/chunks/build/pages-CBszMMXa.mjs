import { N as NuxtLink } from '../virtual/entry.mjs';
import { u as useAsyncData, q as queryCollection } from './client-CtHyGUlj.mjs';
import { defineComponent, withAsyncContext, withCtx, createTextVNode, unref, createVNode, toDisplayString, useSSRContext } from 'file://D:/development/my-blog/node_modules/vue/index.mjs';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'file://D:/development/my-blog/node_modules/vue/server-renderer/index.mjs';
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
    const { data: posts } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("home-posts", () => queryCollection("content").where("path", "LIKE", "/posts/%").order("date", "DESC").limit(3).all())), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = NuxtLink;
      _push(`<!--[--><section class="hero"><p class="eyebrow">PERSONAL JOURNAL \xB7 2026</p><h1>\u628A\u60F3\u6CD5\u5199\u4E0B\u6765\uFF0C<em>\u628A\u7EC3\u4E60\u7559\u4E0B\u6765\u3002</em></h1><p class="lead">\u4E00\u4E2A\u5173\u4E8E\u5B66\u4E60\u3001\u521B\u4F5C\u4E0E\u65E5\u5E38\u89C2\u5BDF\u7684\u4E2A\u4EBA\u7A7A\u95F4\u3002</p><div class="actions">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "button",
        to: "/posts"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) _push2(`\u9605\u8BFB\u6587\u7AE0`);
          else return [createTextVNode("\u9605\u8BFB\u6587\u7AE0")];
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "text-link",
        to: "/artworks"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) _push2(`\u6D4F\u89C8\u753B\u4F5C \u2192`);
          else return [createTextVNode("\u6D4F\u89C8\u753B\u4F5C \u2192")];
        }),
        _: 1
      }, _parent));
      _push(`</div></section><section class="section"><div class="section-head"><h2>\u6700\u65B0\u6587\u7AE0</h2>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/posts" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) _push2(`\u67E5\u770B\u5168\u90E8 \u2192`);
          else return [createTextVNode("\u67E5\u770B\u5168\u90E8 \u2192")];
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="post-list"><!--[-->`);
      ssrRenderList(unref(posts), (post) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: post.path,
          to: post.path,
          class: "post-card"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) _push2(`<span${_scopeId}>${ssrInterpolate(post.date)}</span><h3${_scopeId}>${ssrInterpolate(post.title)}</h3><p${_scopeId}>${ssrInterpolate(post.description)}</p>`);
            else return [
              createVNode("span", null, toDisplayString(post.date), 1),
              createVNode("h3", null, toDisplayString(post.title), 1),
              createVNode("p", null, toDisplayString(post.description), 1)
            ];
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></section><!--]-->`);
    };
  }
});
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var pages_default = index_vue_vue_type_script_setup_true_lang_default;

export { pages_default as default };
//# sourceMappingURL=pages-CBszMMXa.mjs.map
