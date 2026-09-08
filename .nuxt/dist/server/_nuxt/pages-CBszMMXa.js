import { n as NuxtLink } from "../server.mjs";
import { n as useAsyncData, t as queryCollection } from "./client-CtHyGUlj.js";
import { createTextVNode, createVNode, defineComponent, toDisplayString, unref, useSSRContext, withAsyncContext, withCtx } from "vue";
import { ssrInterpolate, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
//#region app/pages/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		const { data: posts } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("home-posts", () => queryCollection("content").where("path", "LIKE", "/posts/%").order("date", "DESC").limit(3).all())), __temp = await __temp, __restore(), __temp);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<!--[--><section class="hero"><p class="eyebrow">PERSONAL JOURNAL · 2026</p><h1>把想法写下来，<em>把练习留下来。</em></h1><p class="lead">一个关于学习、创作与日常观察的个人空间。</p><div class="actions">`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				class: "button",
				to: "/posts"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`阅读文章`);
					else return [createTextVNode("阅读文章")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				class: "text-link",
				to: "/artworks"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`浏览画作 →`);
					else return [createTextVNode("浏览画作 →")];
				}),
				_: 1
			}, _parent));
			_push(`</div></section><section class="section"><div class="section-head"><h2>最新文章</h2>`);
			_push(ssrRenderComponent(_component_NuxtLink, { to: "/posts" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`查看全部 →`);
					else return [createTextVNode("查看全部 →")];
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
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<span${_scopeId}>${ssrInterpolate(post.date)}</span><h3${_scopeId}>${ssrInterpolate(post.title)}</h3><p${_scopeId}>${ssrInterpolate(post.description)}</p>`);
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
//#endregion
//#region app/pages/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var pages_default = index_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { pages_default as default };

//# sourceMappingURL=pages-CBszMMXa.js.map