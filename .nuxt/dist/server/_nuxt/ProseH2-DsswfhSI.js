import { o as useRuntimeConfig } from "./nuxt-RsUFM4iI.js";
import { computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttr, ssrRenderAttrs, ssrRenderSlot } from "vue/server-renderer";
//#region node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH2.vue
var _sfc_main = {
	__name: "ProseH2",
	__ssrInlineRender: true,
	props: { id: {
		type: String,
		required: false
	} },
	setup(__props) {
		const props = __props;
		const { headings } = useRuntimeConfig().public.mdc;
		const generate = computed(() => props.id && (typeof headings?.anchorLinks === "boolean" && headings?.anchorLinks === true || typeof headings?.anchorLinks === "object" && headings?.anchorLinks?.h2));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<h2${ssrRenderAttrs(mergeProps({ id: props.id }, _attrs))}>`);
			if (props.id && unref(generate)) {
				_push(`<a${ssrRenderAttr("href", `#${props.id}`)}>`);
				ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
				_push(`</a>`);
			} else ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</h2>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH2.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };

//# sourceMappingURL=ProseH2-DsswfhSI.js.map