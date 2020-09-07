
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.24.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\App.svelte generated by Svelte v3.24.1 */
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	child_ctx[19] = i;
    	return child_ctx;
    }

    // (145:6) {#each wordsToType as word, i}
    function create_each_block(ctx) {
    	let p;
    	let t0_value = /*word*/ ctx[17] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(p, "class", "word svelte-klungf");
    			toggle_class(p, "word--active", /*i*/ ctx[19] === /*currentWordIndex*/ ctx[2]);
    			toggle_class(p, "word--incorrect", /*i*/ ctx[19] === /*currentWordIndex*/ ctx[2] && /*currentWordIsSpeltIncorrectly*/ ctx[5]);
    			add_location(p, file, 145, 8, 3786);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*wordsToType*/ 16 && t0_value !== (t0_value = /*word*/ ctx[17] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*currentWordIndex*/ 4) {
    				toggle_class(p, "word--active", /*i*/ ctx[19] === /*currentWordIndex*/ ctx[2]);
    			}

    			if (dirty & /*currentWordIndex, currentWordIsSpeltIncorrectly*/ 36) {
    				toggle_class(p, "word--incorrect", /*i*/ ctx[19] === /*currentWordIndex*/ ctx[2] && /*currentWordIsSpeltIncorrectly*/ ctx[5]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(145:6) {#each wordsToType as word, i}",
    		ctx
    	});

    	return block;
    }

    // (155:2) {#if !completedSession}
    function create_if_block_1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "id", "input-text");
    			attr_dev(input, "autocomplete", "off");
    			add_location(input, file, 155, 2, 4049);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*inputText*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[9]),
    					listen_dev(input, "keydown", /*handleKeyDown*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*inputText*/ 2 && input.value !== /*inputText*/ ctx[1]) {
    				set_input_value(input, /*inputText*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(155:2) {#if !completedSession}",
    		ctx
    	});

    	return block;
    }

    // (158:2) {#if completedSession}
    function create_if_block(ctx) {
    	let p;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("You typed ");
    			t1 = text(/*wordsTyped*/ ctx[0]);
    			t2 = text(" words in a minute!");
    			t3 = space();
    			button = element("button");
    			button.textContent = "Go again";
    			add_location(p, file, 158, 4, 4180);
    			add_location(button, file, 159, 4, 4233);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*restart*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*wordsTyped*/ 1) set_data_dev(t1, /*wordsTyped*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(158:2) {#if completedSession}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let p;
    	let t2;
    	let t3;
    	let div1;
    	let div0;
    	let t4;
    	let t5;
    	let each_value = /*wordsToType*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let if_block0 = !/*completedSession*/ ctx[3] && create_if_block_1(ctx);
    	let if_block1 = /*completedSession*/ ctx[3] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Typist";
    			t1 = space();
    			p = element("p");
    			t2 = text(/*timeElapsedDisplay*/ ctx[6]);
    			t3 = space();
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			if (if_block0) if_block0.c();
    			t5 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(h1, "class", "svelte-klungf");
    			add_location(h1, file, 140, 2, 3624);
    			add_location(p, file, 141, 2, 3642);
    			attr_dev(div0, "class", "word-container__inner svelte-klungf");
    			add_location(div0, file, 143, 4, 3705);
    			attr_dev(div1, "class", "word-container svelte-klungf");
    			add_location(div1, file, 142, 2, 3672);
    			attr_dev(main, "class", "svelte-klungf");
    			add_location(main, file, 139, 0, 3615);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, p);
    			append_dev(p, t2);
    			append_dev(main, t3);
    			append_dev(main, div1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(main, t4);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t5);
    			if (if_block1) if_block1.m(main, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*timeElapsedDisplay*/ 64) set_data_dev(t2, /*timeElapsedDisplay*/ ctx[6]);

    			if (dirty & /*currentWordIndex, currentWordIsSpeltIncorrectly, wordsToType*/ 52) {
    				each_value = /*wordsToType*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (!/*completedSession*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(main, t5);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*completedSession*/ ctx[3]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(main, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	const hundredMostCommonWords = `a,about,all,also,and,as,at,be,because,but,by,can,come,could,day,do,even,find,first,for,from,get,give,go,have,he,her,here,him,his,how,I,if,in,into,it,its,just,know,like,look,make,man,many,me,more,my,new,no,not,now,of,on,one,only,or,other,our,out,people,say,see,she,so,some,take,tell,than,that,the,their,them,then,there,these,they,thing,think,this,those,time,to,two,up,use,very,want,way,we,well,what,when,which,who,will,with,would,year,you,your`.split(",");
    	let wordsTyped = 0;
    	let inputText = "";
    	let secondsElapsed = 0;
    	let currentWordIndex = 0;
    	let dateTimeTypingStarted;
    	let completedSession = false;
    	let timerStarted = false;
    	let timeout;
    	const getRandomNumBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    	let wordsToType = new Array(3000).fill("").map(x => hundredMostCommonWords[getRandomNumBetween(0, 99)]);

    	function startTime() {
    		const now = new Date();
    		const secondsBetweenNowAndWhenTypingBegan = (now - dateTimeTypingStarted) / 1000;
    		$$invalidate(10, secondsElapsed = Math.round(secondsBetweenNowAndWhenTypingBegan));

    		if (secondsElapsed >= 60) {
    			$$invalidate(3, completedSession = true);
    			clearTimeout(timeout);
    			$$invalidate(4, wordsToType = []);
    			document.querySelector("#input-text").blur();
    			return;
    		}

    		timeout = setTimeout(startTime, 500);
    	}

    	function handleKeyDown(ev) {
    		if (completedSession) {
    			return;
    		}

    		if (!timerStarted) {
    			dateTimeTypingStarted = new Date();
    			startTime();
    			timerStarted = true;
    		}

    		if (ev.key === " ") {
    			ev.preventDefault();
    			const wordMatches = inputText === wordsToType[currentWordIndex];

    			if (wordMatches) {
    				$$invalidate(0, wordsTyped += 1);
    				$$invalidate(1, inputText = "");

    				if (currentWordIndex === wordsToType.length) {
    					$$invalidate(2, currentWordIndex = 0);
    				}

    				$$invalidate(4, wordsToType = wordsToType.slice(1));
    			}
    		}
    	}

    	onMount(() => {
    		document.querySelector("#input-text").focus();
    	});

    	async function restart() {
    		timerStarted = false;
    		$$invalidate(10, secondsElapsed = 0);
    		$$invalidate(1, inputText = "");
    		$$invalidate(0, wordsTyped = 0);
    		$$invalidate(4, wordsToType = new Array(3000).fill("").map(x => hundredMostCommonWords[getRandomNumBetween(0, 99)]));
    		$$invalidate(3, completedSession = false);
    		await tick();
    		document.querySelector("#input-text").focus();
    		dateTimeTypingStarted = null;
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	function input_input_handler() {
    		inputText = this.value;
    		$$invalidate(1, inputText);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		tick,
    		hundredMostCommonWords,
    		wordsTyped,
    		inputText,
    		secondsElapsed,
    		currentWordIndex,
    		dateTimeTypingStarted,
    		completedSession,
    		timerStarted,
    		timeout,
    		getRandomNumBetween,
    		wordsToType,
    		startTime,
    		handleKeyDown,
    		restart,
    		currentWordIsSpeltIncorrectly,
    		timeElapsedDisplay
    	});

    	$$self.$inject_state = $$props => {
    		if ("wordsTyped" in $$props) $$invalidate(0, wordsTyped = $$props.wordsTyped);
    		if ("inputText" in $$props) $$invalidate(1, inputText = $$props.inputText);
    		if ("secondsElapsed" in $$props) $$invalidate(10, secondsElapsed = $$props.secondsElapsed);
    		if ("currentWordIndex" in $$props) $$invalidate(2, currentWordIndex = $$props.currentWordIndex);
    		if ("dateTimeTypingStarted" in $$props) dateTimeTypingStarted = $$props.dateTimeTypingStarted;
    		if ("completedSession" in $$props) $$invalidate(3, completedSession = $$props.completedSession);
    		if ("timerStarted" in $$props) timerStarted = $$props.timerStarted;
    		if ("timeout" in $$props) timeout = $$props.timeout;
    		if ("wordsToType" in $$props) $$invalidate(4, wordsToType = $$props.wordsToType);
    		if ("currentWordIsSpeltIncorrectly" in $$props) $$invalidate(5, currentWordIsSpeltIncorrectly = $$props.currentWordIsSpeltIncorrectly);
    		if ("timeElapsedDisplay" in $$props) $$invalidate(6, timeElapsedDisplay = $$props.timeElapsedDisplay);
    	};

    	let currentWordIsSpeltIncorrectly;
    	let timeElapsedDisplay;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*inputText, wordsToType, currentWordIndex*/ 22) {
    			 $$invalidate(5, currentWordIsSpeltIncorrectly = inputText.length && wordsToType.length && !wordsToType[currentWordIndex].startsWith(inputText));
    		}

    		if ($$self.$$.dirty & /*secondsElapsed*/ 1024) {
    			 $$invalidate(6, timeElapsedDisplay = secondsElapsed === 60
    			? `01:00`
    			: `00:${secondsElapsed < 10 ? "0" : ""}${secondsElapsed.toString()}`);
    		}
    	};

    	return [
    		wordsTyped,
    		inputText,
    		currentWordIndex,
    		completedSession,
    		wordsToType,
    		currentWordIsSpeltIncorrectly,
    		timeElapsedDisplay,
    		handleKeyDown,
    		restart,
    		input_input_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
