import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'file://D:/development/my-blog/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderSlot } from 'file://D:/development/my-blog/node_modules/vue/server-renderer/index.mjs';
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

var Alert_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "Alert",
  __ssrInlineRender: true,
  props: { color: {
    type: String,
    default: "orange"
  } },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "alert",
        style: { "border-color": __props.color }
      }, _attrs))} data-v-46dbbe98>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
var _sfc_setup = Alert_vue_vue_type_script_setup_true_lang_default.setup;
Alert_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Alert.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Alert_default = /* @__PURE__ */ Object.assign(_plugin_vue_export_helper_default(Alert_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-46dbbe98"]]), { __name: "Alert" });

export { Alert_default as default };
//# sourceMappingURL=Alert-DaG6bgAK.mjs.map
