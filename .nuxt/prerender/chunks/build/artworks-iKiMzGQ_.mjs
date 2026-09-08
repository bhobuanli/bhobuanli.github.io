import { defineComponent, useSSRContext } from 'file://D:/development/my-blog/node_modules/vue/index.mjs';
import { ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'file://D:/development/my-blog/node_modules/vue/server-renderer/index.mjs';

var artworks_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "artworks",
  __ssrInlineRender: true,
  setup(__props) {
    const artworks = [{
      title: "\u89D2\u8272\u7EC3\u4E60 001",
      date: "2026-09-08",
      image: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=900&q=80",
      source: "https://www.pixiv.net/"
    }, {
      title: "\u5149\u5F71\u901F\u5199",
      date: "2026-08-21",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&q=80",
      source: "https://x.com/"
    }];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><section class="page-intro"><p class="eyebrow">SKETCHBOOK</p><h1>\u753B\u4F5C\u7EC3\u4E60</h1><p class="lead">\u628A\u8FC7\u7A0B\u7559\u4E0B\u6765\uFF0C\u6162\u6162\u770B\u89C1\u81EA\u5DF1\u7684\u53D8\u5316\u3002</p></section><div class="art-grid"><!--[-->`);
      ssrRenderList(artworks, (art) => {
        _push(`<a${ssrRenderAttr("href", art.source)} target="_blank" rel="noreferrer" class="art-card"><img${ssrRenderAttr("src", art.image)}${ssrRenderAttr("alt", art.title)} loading="lazy"><div><span>${ssrInterpolate(art.date)}</span><h2>${ssrInterpolate(art.title)}</h2></div></a>`);
      });
      _push(`<!--]--></div><!--]-->`);
    };
  }
});
var _sfc_setup = artworks_vue_vue_type_script_setup_true_lang_default.setup;
artworks_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/artworks.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var artworks_default = artworks_vue_vue_type_script_setup_true_lang_default;

export { artworks_default as default };
//# sourceMappingURL=artworks-iKiMzGQ_.mjs.map
