import { t as _plugin_vue_export_helper_default } from "../server.mjs";
import { defineComponent, ref, unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs } from "vue/server-renderer";
//#region app/components/Counter.vue?vue&type=script&setup=true&lang.ts
var Counter_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Counter",
	__ssrInlineRender: true,
	setup(__props) {
		const count = ref(0);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(_attrs)} data-v-5c5d582e><h3 data-v-5c5d582e>Counter: ${ssrInterpolate(unref(count))}</h3><button data-v-5c5d582e> Increment </button><button data-v-5c5d582e> Decrement </button></div>`);
		};
	}
});
//#endregion
//#region app/components/Counter.vue
var _sfc_setup = Counter_vue_vue_type_script_setup_true_lang_default.setup;
Counter_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Counter.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Counter_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(Counter_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-5c5d582e"]]), { __name: "Counter" });
//#endregion
export { Counter_default as default };

//# sourceMappingURL=Counter-wfsT495B.js.map