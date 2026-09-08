import { t as _plugin_vue_export_helper_default } from "../server.mjs";
import { defineComponent, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderSlot } from "vue/server-renderer";
//#region app/components/Alert.vue?vue&type=script&setup=true&lang.ts
var Alert_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
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
//#endregion
//#region app/components/Alert.vue
var _sfc_setup = Alert_vue_vue_type_script_setup_true_lang_default.setup;
Alert_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Alert.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Alert_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(Alert_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-46dbbe98"]]), { __name: "Alert" });
//#endregion
export { Alert_default as default };

//# sourceMappingURL=Alert-DaG6bgAK.js.map