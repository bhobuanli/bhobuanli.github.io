import { t as _plugin_vue_export_helper_default } from "../server.mjs";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderSlot } from "vue/server-renderer";
//#region node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTable.vue
var _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
	_push(`<table${ssrRenderAttrs(_attrs)}>`);
	ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
	_push(`</table>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTable.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var ProseTable_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "ProseTable" });
//#endregion
export { ProseTable_default as default };

//# sourceMappingURL=ProseTable-CtovSIaO.js.map