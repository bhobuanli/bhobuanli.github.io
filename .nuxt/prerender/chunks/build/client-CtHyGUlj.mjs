import { t as tryUseNuxtApp, b as appDiagnostics, s as sanitizeTag, d as useNuxtApp, e as asyncDataDefaults, p as prodReporters, f as docsBase, c as createError$1 } from '../virtual/entry.mjs';
import { defineProdDiagnostics } from 'file://D:/development/my-blog/node_modules/nostics/dist/index.mjs';
import { defineComponent, createElementBlock, shallowRef, getCurrentInstance, provide, cloneVNode, h, isRef, computed, toValue, onServerPrefetch, ref, nextTick, unref, toRef, queuePostFlushCb } from 'file://D:/development/my-blog/node_modules/vue/index.mjs';
import { withoutTrailingSlash } from 'file://D:/development/my-blog/node_modules/ufo/dist/index.mjs';
import { getRequestHeaders } from 'file://D:/development/my-blog/node_modules/h3/dist/index.mjs';

function debounceTick(fn, options = {}) {
  let leadingValue;
  let active = false;
  let resolveList = [];
  let currentPromise;
  let trailingArgs;
  const applyFn = (_this, args) => {
    const promise = _applyPromised(fn, _this, args);
    currentPromise = promise;
    promise.finally(() => {
      currentPromise = void 0;
      if (trailingArgs && !active) {
        const args2 = trailingArgs;
        trailingArgs = void 0;
        applyFn(_this, args2);
      }
    });
    return promise;
  };
  return function(...args) {
    trailingArgs = args;
    if (currentPromise) return currentPromise;
    return new Promise((resolve) => {
      const shouldCallNow = options.leading && !active;
      if (!active) {
        active = true;
        queuePostFlushCb(() => {
          active = false;
          const flushArgs = trailingArgs != null ? trailingArgs : args;
          trailingArgs = void 0;
          const promise = options.leading ? leadingValue : applyFn(this, flushArgs);
          for (const _resolve of resolveList) _resolve(promise);
          resolveList = [];
        });
      }
      if (shouldCallNow) {
        leadingValue = applyFn(this, args);
        resolve(leadingValue);
      } else resolveList.push(resolve);
    });
  };
}
async function _applyPromised(fn, _this, args) {
  return await fn.apply(_this, args);
}
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
var clientOnlySymbol = /* @__PURE__ */ Symbol.for("nuxt:client-only");
defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: [
    "fallback",
    "placeholder",
    "placeholderTag",
    "fallbackTag"
  ],
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) vm._nuxtClientOnly = true;
    provide(clientOnlySymbol, true);
    return () => {
      var _a;
      if (mounted.value) {
        const vnodes = (_a = slots.default) == null ? void 0 : _a.call(slots);
        if (vnodes && vnodes.length === 1) return [cloneVNode(vnodes[0], attrs)];
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) return h(slot);
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = sanitizeTag(props.fallbackTag || props.placeholderTag, "span");
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
function defineKeyedFunctionFactory(factory) {
  const placeholder = function() {
    throw appDiagnostics.NUXT_E1007({ name: factory.name });
  };
  return Object.defineProperty(placeholder, "__nuxt_factory", {
    enumerable: false,
    get: () => factory.factory
  });
}
var dataDiagnostics = /* @__PURE__ */ defineProdDiagnostics({
  docsBase,
  reporters: prodReporters
});
var createUseAsyncData = defineKeyedFunctionFactory({
  name: "createUseAsyncData",
  factory(options = {}) {
    function useAsyncData2(...args) {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
      if (_isAutoKeyNeeded(args[0], args[1])) args.unshift(autoKey);
      let [_key, _handler, opts = {}] = args;
      const key = isRef(_key) || typeof _key === "function" ? computed(() => toValue(_key)) : { value: _key };
      if (!key.value || typeof key.value !== "string") throw dataDiagnostics.NUXT_E3008();
      if (typeof _handler !== "function") throw dataDiagnostics.NUXT_E3009();
      const shouldFactoryOptionsOverride = typeof options === "function";
      const nuxtApp = useNuxtApp();
      const factoryOptions = shouldFactoryOptionsOverride ? options(opts) : options;
      if (!shouldFactoryOptionsOverride) for (const key2 in factoryOptions) {
        if (factoryOptions[key2] === void 0) continue;
        if (opts[key2] !== void 0) continue;
        opts[key2] = factoryOptions[key2];
      }
      (_a = opts.server) != null ? _a : opts.server = true;
      (_b = opts.default) != null ? _b : opts.default = getDefault;
      (_c = opts.getCachedData) != null ? _c : opts.getCachedData = getDefaultCachedData;
      (_d = opts.lazy) != null ? _d : opts.lazy = false;
      (_e = opts.immediate) != null ? _e : opts.immediate = true;
      (_f = opts.deep) != null ? _f : opts.deep = asyncDataDefaults.deep;
      (_g = opts.dedupe) != null ? _g : opts.dedupe = "cancel";
      (_h = opts.enabled) != null ? _h : opts.enabled = true;
      if (shouldFactoryOptionsOverride) for (const key2 in factoryOptions) {
        if (factoryOptions[key2] === void 0) continue;
        opts[key2] = factoryOptions[key2];
      }
      nuxtApp._asyncData[key.value];
      function createInitialFetch() {
        const initialFetchOptions = {
          cause: "initial",
          dedupe: opts.dedupe
        };
        const existing = nuxtApp._asyncData[key.value];
        if (!(existing == null ? void 0 : existing._init)) {
          initialFetchOptions.cachedData = opts.getCachedData(key.value, nuxtApp, { cause: "initial" });
          nuxtApp._asyncData[key.value] = buildAsyncData(nuxtApp, key.value, _handler, opts, initialFetchOptions.cachedData);
          nuxtApp._asyncData[key.value]._initialCachedData = initialFetchOptions.cachedData;
        } else if (nuxtApp._asyncDataPromises[key.value]) initialFetchOptions.cachedData = existing._initialCachedData;
        return () => nuxtApp._asyncData[key.value].execute(initialFetchOptions);
      }
      const initialFetch = createInitialFetch();
      const asyncData = nuxtApp._asyncData[key.value];
      asyncData._deps++;
      if (opts.server !== false && nuxtApp.payload.serverRendered && opts.immediate) {
        const promise = initialFetch();
        if (getCurrentInstance()) onServerPrefetch(() => promise);
        else nuxtApp.hook("app:created", async () => {
          await promise;
        });
      }
      const asyncReturn = {
        data: writableComputedRef(() => {
          var _a2;
          return (_a2 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a2.data;
        }),
        pending: writableComputedRef(() => {
          var _a2;
          return (_a2 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a2.pending;
        }),
        status: writableComputedRef(() => {
          var _a2;
          return (_a2 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a2.status;
        }),
        error: writableComputedRef(() => {
          var _a2;
          return (_a2 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a2.error;
        }),
        refresh: (...args2) => {
          var _a2;
          if (!((_a2 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a2._init)) return createInitialFetch()();
          return nuxtApp._asyncData[key.value].execute(...args2);
        },
        execute: (...args2) => asyncReturn.refresh(...args2),
        clear: () => {
          const entry = nuxtApp._asyncData[key.value];
          if (entry == null ? void 0 : entry._abortController) try {
            entry._abortController.abort(new DOMException("AsyncData aborted by user.", "AbortError"));
          } finally {
            entry._abortController = void 0;
          }
          clearNuxtDataByKey(nuxtApp, key.value);
        }
      };
      const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key.value]).then(() => asyncReturn);
      Object.assign(asyncDataPromise, asyncReturn);
      Object.defineProperties(asyncDataPromise, {
        then: {
          enumerable: true,
          value: asyncDataPromise.then.bind(asyncDataPromise)
        },
        catch: {
          enumerable: true,
          value: asyncDataPromise.catch.bind(asyncDataPromise)
        },
        finally: {
          enumerable: true,
          value: asyncDataPromise.finally.bind(asyncDataPromise)
        }
      });
      return asyncDataPromise;
    }
    return useAsyncData2;
  }
});
var useAsyncData = createUseAsyncData.__nuxt_factory();
createUseAsyncData.__nuxt_factory({
  lazy: true,
  _functionName: "useLazyAsyncData"
});
function writableComputedRef(getter) {
  return computed({
    get() {
      var _a;
      return (_a = getter()) == null ? void 0 : _a.value;
    },
    set(value) {
      const ref2 = getter();
      if (ref2) ref2.value = value;
    }
  });
}
function _isAutoKeyNeeded(keyOrFetcher, fetcher) {
  if (typeof keyOrFetcher === "string") return false;
  if (typeof keyOrFetcher === "object" && keyOrFetcher !== null) return false;
  if (typeof keyOrFetcher === "function" && typeof fetcher === "function") return false;
  return true;
}
function clearNuxtDataByKey(nuxtApp, key) {
  delete nuxtApp.payload.data[key];
  delete nuxtApp.payload._errors[key];
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = unref(nuxtApp._asyncData[key]._default());
    nuxtApp._asyncData[key].error.value = void 0;
    nuxtApp._asyncData[key].status.value = "idle";
    nuxtApp._asyncData[key]._initialCachedData = void 0;
  }
  delete nuxtApp._asyncDataPromises[key];
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) newObj[key] = obj[key];
  return newObj;
}
function buildAsyncData(nuxtApp, key, _handler, options, initialCachedData) {
  var _a, _b, _c;
  (_b = (_a = nuxtApp.payload._errors)[key]) != null ? _b : _a[key] = void 0;
  const hasCustomGetCachedData = options.getCachedData !== getDefaultCachedData;
  const handler = !((_c = nuxtApp.ssrContext) == null ? void 0 : _c["~sharedPrerenderCache"]) ? _handler : (nuxtApp2, options2) => {
    const value = nuxtApp2.ssrContext["~sharedPrerenderCache"].get(key);
    if (value) return value;
    const promise = Promise.resolve().then(() => nuxtApp2.runWithContext(() => _handler(nuxtApp2, options2)));
    nuxtApp2.ssrContext["~sharedPrerenderCache"].set(key, promise);
    return promise;
  };
  const _ref = options.deep ? ref : shallowRef;
  const hasCachedData = initialCachedData !== void 0;
  const unsubRefreshAsyncData = nuxtApp.hook("app:data:refresh", async (keys) => {
    if (!keys || keys.includes(key)) await asyncData.execute({ cause: "refresh:hook" });
  });
  const asyncData = {
    data: _ref(hasCachedData ? initialCachedData : options.default()),
    pending: computed(() => asyncData.status.value === "pending"),
    error: toRef(nuxtApp.payload._errors, key),
    status: shallowRef("idle"),
    execute: (...args) => {
      var _a2, _b2;
      const [_opts, newValue = void 0] = args;
      const opts = _opts && newValue === void 0 && typeof _opts === "object" ? _opts : {};
      if (nuxtApp._asyncDataPromises[key]) {
        if (((_a2 = opts.dedupe) != null ? _a2 : options.dedupe) === "defer") return nuxtApp._asyncDataPromises[key];
      }
      {
        const cachedData = "cachedData" in opts ? opts.cachedData : options.getCachedData(key, nuxtApp, { cause: (_b2 = opts.cause) != null ? _b2 : "refresh:manual" });
        if (cachedData !== void 0) {
          nuxtApp.payload.data[key] = asyncData.data.value = cachedData;
          asyncData.error.value = void 0;
          asyncData.status.value = "success";
          return Promise.resolve(cachedData);
        }
      }
      if (toValue(options.enabled) === false) return Promise.resolve(asyncData.data.value);
      if (asyncData._abortController) asyncData._abortController.abort(new DOMException("AsyncData request cancelled by deduplication", "AbortError"));
      asyncData._abortController = new AbortController();
      asyncData.status.value = "pending";
      const cleanupController = new AbortController();
      const promise = new Promise((resolve, reject) => {
        var _a3, _b3;
        try {
          const timeout = (_a3 = opts.timeout) != null ? _a3 : options.timeout;
          const mergedSignal = mergeAbortSignals([(_b3 = asyncData._abortController) == null ? void 0 : _b3.signal, opts == null ? void 0 : opts.signal], cleanupController.signal, timeout);
          if (mergedSignal.aborted) {
            const reason = mergedSignal.reason;
            reject(reason instanceof Error ? reason : new DOMException(String(reason != null ? reason : "Aborted"), "AbortError"));
            return;
          }
          mergedSignal.addEventListener("abort", () => {
            const reason = mergedSignal.reason;
            reject(reason instanceof Error ? reason : new DOMException(String(reason != null ? reason : "Aborted"), "AbortError"));
          }, {
            once: true,
            signal: cleanupController.signal
          });
          return Promise.resolve(handler(nuxtApp, { signal: mergedSignal })).then(resolve, reject);
        } catch (err) {
          reject(err);
        }
      }).then(async (_result) => {
        if (nuxtApp._asyncDataPromises[key] !== promise) return;
        let result = _result;
        if (options.transform) result = await options.transform(_result);
        if (options.pick) result = pick(result, options.pick);
        nuxtApp.payload.data[key] = result;
        asyncData.data.value = result;
        asyncData.error.value = void 0;
        asyncData.status.value = "success";
      }).catch((error) => {
        var _a3;
        if (nuxtApp._asyncDataPromises[key] !== promise) return nuxtApp._asyncDataPromises[key];
        if ((_a3 = asyncData._abortController) == null ? void 0 : _a3.signal.aborted) return nuxtApp._asyncDataPromises[key];
        if (typeof DOMException !== "undefined" && error instanceof DOMException && error.name === "AbortError") {
          asyncData.status.value = "idle";
          return nuxtApp._asyncDataPromises[key];
        }
        asyncData.error.value = createError$1(error);
        asyncData.data.value = unref(options.default());
        asyncData.status.value = "error";
      }).finally(() => {
        cleanupController.abort();
        if (nuxtApp._asyncDataPromises[key] === promise) delete nuxtApp._asyncDataPromises[key];
      });
      nuxtApp._asyncDataPromises[key] = promise;
      return nuxtApp._asyncDataPromises[key];
    },
    _execute: debounceTick((...args) => asyncData.execute(...args)),
    _default: options.default,
    _deps: 0,
    _init: true,
    _hash: void 0,
    _off: () => {
      var _a2, _b2;
      unsubRefreshAsyncData();
      if ((_a2 = nuxtApp._asyncData[key]) == null ? void 0 : _a2._init) nuxtApp._asyncData[key]._init = false;
      if (nuxtApp._asyncDataPromises[key]) {
        (_b2 = asyncData._abortController) == null ? void 0 : _b2.abort(new DOMException("AsyncData request cancelled by unmount", "AbortError"));
        delete nuxtApp._asyncDataPromises[key];
        if (asyncData.status.value === "pending") asyncData.status.value = "idle";
      }
      if (!hasCustomGetCachedData) nextTick(() => {
        var _a3;
        if (!((_a3 = nuxtApp._asyncData[key]) == null ? void 0 : _a3._init)) {
          clearNuxtDataByKey(nuxtApp, key);
          asyncData.execute = () => Promise.resolve();
        }
      });
    }
  };
  return asyncData;
}
var getDefault = () => void 0;
var getDefaultCachedData = (key, nuxtApp, ctx) => {
  if (nuxtApp.isHydrating) return nuxtApp.payload.data[key];
  if (ctx.cause !== "refresh:manual" && ctx.cause !== "refresh:hook") return nuxtApp.static.data[key];
};
function mergeAbortSignals(signals, cleanupSignal, timeout) {
  var _a, _b, _c;
  const list = signals.filter((s) => !!s);
  if (typeof timeout === "number" && timeout >= 0) {
    const timeoutSignal = (_a = AbortSignal.timeout) == null ? void 0 : _a.call(AbortSignal, timeout);
    if (timeoutSignal) list.push(timeoutSignal);
  }
  if (AbortSignal.any) return AbortSignal.any(list);
  const controller = new AbortController();
  for (const sig of list) if (sig.aborted) {
    const reason = (_b = sig.reason) != null ? _b : new DOMException("Aborted", "AbortError");
    try {
      controller.abort(reason);
    } catch {
      controller.abort();
    }
    return controller.signal;
  }
  const onAbort = () => {
    var _a2, _b2;
    const reason = (_b2 = (_a2 = list.find((s) => s.aborted)) == null ? void 0 : _a2.reason) != null ? _b2 : new DOMException("Aborted", "AbortError");
    try {
      controller.abort(reason);
    } catch {
      controller.abort();
    }
  };
  for (const sig of list) (_c = sig.addEventListener) == null ? void 0 : _c.call(sig, "abort", onAbort, {
    once: true,
    signal: cleanupSignal
  });
  return controller.signal;
}
var checksums = { "content": "v3.5.0--wsvjNI64hDX7eAB0OHP915YSHG1rD8P8cnv9y8VTjB8" };
var tables = {
  "content": "_content_content",
  "info": "_content_info"
};
var buildGroup = (group, type) => {
  const conditions = group._conditions;
  return conditions.length > 0 ? `(${conditions.join(` ${type} `)})` : "";
};
var collectionQueryGroup = (collection) => {
  const conditions = [];
  const query = {
    _conditions: conditions,
    where(field, operator, value) {
      let condition;
      switch (operator.toUpperCase()) {
        case "IN":
        case "NOT IN":
          if (Array.isArray(value)) {
            const values = value.map((val) => singleQuote(val)).join(", ");
            condition = `"${String(field)}" ${operator.toUpperCase()} (${values})`;
          } else throw new TypeError(`Value for ${operator} must be an array`);
          break;
        case "BETWEEN":
        case "NOT BETWEEN":
          if (Array.isArray(value) && value.length === 2) condition = `"${String(field)}" ${operator.toUpperCase()} ${singleQuote(value[0])} AND ${singleQuote(value[1])}`;
          else throw new Error(`Value for ${operator} must be an array with two elements`);
          break;
        case "IS NULL":
        case "IS NOT NULL":
          condition = `"${String(field)}" ${operator.toUpperCase()}`;
          break;
        case "LIKE":
        case "NOT LIKE":
          condition = `"${String(field)}" ${operator.toUpperCase()} ${singleQuote(value)}`;
          break;
        default:
          condition = `"${String(field)}" ${operator} ${singleQuote(typeof value === "boolean" ? Number(value) : value)}`;
      }
      conditions.push(`${condition}`);
      return query;
    },
    andWhere(groupFactory) {
      const group = groupFactory(collectionQueryGroup());
      conditions.push(buildGroup(group, "AND"));
      return query;
    },
    orWhere(groupFactory) {
      const group = groupFactory(collectionQueryGroup());
      conditions.push(buildGroup(group, "OR"));
      return query;
    }
  };
  return query;
};
var collectionQueryBuilder = (collection, fetch) => {
  const params = {
    conditions: [],
    selectedFields: [],
    offset: 0,
    limit: 0,
    orderBy: [],
    count: {
      field: "",
      distinct: false
    }
  };
  const query = {
    __params: params,
    andWhere(groupFactory) {
      const group = groupFactory(collectionQueryGroup());
      params.conditions.push(buildGroup(group, "AND"));
      return query;
    },
    orWhere(groupFactory) {
      const group = groupFactory(collectionQueryGroup());
      params.conditions.push(buildGroup(group, "OR"));
      return query;
    },
    path(path) {
      return query.where("path", "=", withoutTrailingSlash(path));
    },
    skip(skip) {
      params.offset = skip;
      return query;
    },
    where(field, operator, value) {
      query.andWhere((group) => group.where(String(field), operator, value));
      return query;
    },
    limit(limit) {
      params.limit = limit;
      return query;
    },
    select(...fields) {
      if (fields.length) params.selectedFields.push(...fields);
      return query;
    },
    order(field, direction) {
      params.orderBy.push(`"${String(field)}" ${direction}`);
      return query;
    },
    async all() {
      return fetch(collection, buildQuery()).then((res) => res || []);
    },
    async first() {
      return fetch(collection, buildQuery({ limit: 1 })).then((res) => res[0] || null);
    },
    async count(field = "*", distinct = false) {
      return fetch(collection, buildQuery({ count: {
        field: String(field),
        distinct
      } })).then((m) => m[0].count);
    }
  };
  function buildQuery(opts = {}) {
    let query2 = "SELECT ";
    if (opts == null ? void 0 : opts.count) query2 += `COUNT(${opts.count.distinct ? "DISTINCT " : ""}${opts.count.field}) as count`;
    else {
      const fields = Array.from(new Set(params.selectedFields));
      query2 += fields.length > 0 ? fields.map((f) => `"${String(f)}"`).join(", ") : "*";
    }
    query2 += ` FROM ${tables[String(collection)]}`;
    if (params.conditions.length > 0) query2 += ` WHERE ${params.conditions.join(" AND ")}`;
    if (params.orderBy.length > 0) query2 += ` ORDER BY ${params.orderBy.join(", ")}`;
    else query2 += ` ORDER BY stem ASC`;
    const limit = (opts == null ? void 0 : opts.limit) || params.limit;
    if (limit > 0) {
      if (params.offset > 0) query2 += ` LIMIT ${limit} OFFSET ${params.offset}`;
      else query2 += ` LIMIT ${limit}`;
    }
    return query2;
  }
  return query;
};
function singleQuote(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}
async function fetchContent(event, collection, path, options) {
  const headers = event ? getRequestHeaders(event) : {};
  headers["accept-encoding"] = void 0;
  const url = `/__nuxt_content/${collection}/${path}`;
  const fetchOptions = {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    },
    query: {
      v: checksums[String(collection)],
      t: void 0
    }
  };
  return event ? await event.$fetch(url, fetchOptions) : await $fetch(url, fetchOptions);
}
async function fetchQuery(event, collection, sql) {
  return fetchContent(event, collection, "query", {
    headers: { "content-type": "application/json" },
    method: "POST",
    body: { sql }
  });
}
var queryCollection = (collection) => {
  var _a, _b;
  const event = (_b = (_a = tryUseNuxtApp()) == null ? void 0 : _a.ssrContext) == null ? void 0 : _b.event;
  return collectionQueryBuilder(collection, (collection2, sql) => executeContentQuery(event, collection2, sql));
};
async function executeContentQuery(event, collection, sql) {
  return fetchQuery(event, String(collection), sql);
}

export { queryCollection as q, useAsyncData as u };
//# sourceMappingURL=client-CtHyGUlj.mjs.map
