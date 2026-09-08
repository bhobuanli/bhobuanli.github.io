import { n as NuxtLink } from "../server.mjs";
import { mergeProps, renderSlot, useSSRContext, withCtx } from "vue";
import { ssrRenderComponent, ssrRenderSlot } from "vue/server-renderer";
//#region node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseA.vue
var _sfc_main = {
	__name: "ProseA",
	__ssrInlineRender: true,
	props: {
		href: {
			type: String,
			default: ""
		},
		target: {
			type: String,
			default: void 0,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(NuxtLink, mergeProps({
				href: props.href,
				target: props.target
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "default")];
				}),
				_: 3
			}, _parent));
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseA.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };

//# sourceMappingURL=ProseA-BL4SEFU3.js.map