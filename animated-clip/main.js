(function(){
	var menu1 = document.querySelector(".method1-menu"),
		btn1 = document.querySelector("#method1-btn"),
		menu2 = document.querySelector(".method2-menu"),
		btn2 = document.querySelector("#method2-btn"),
		menu3 = document.querySelector(".method3-menu"),
		btn3 = document.querySelector("#method3-btn"),
		menu3Con = menu3.querySelector(".menu-contents");

	btn1.onclick = function(){
		menu1.classList.toggle('method1-menu-collapsed');
	};

	btn2.onclick = function(){
		menu2.classList.toggle('method2-menu-collapsed');
	};

	class Menu {
	  constructor () {
	    this._menu = document.querySelector('.method3-menu');
	    this._menuContents = this._menu.querySelector('.menu-contents');
	    this._menuToggleButton = this._menu.querySelector('#method3-btn');
	    this._menuTitle = this._menu.querySelector('.menu-title');

	    this._expanded = true;
	    this._animate = false;
	    this._collapsed;

	    this.expand = this.expand.bind(this);
	    this.collapse = this.collapse.bind(this);
	    this.toggle = this.toggle.bind(this);

	    this._calculateScales();
	    this._createEaseAnimations();
	    this._addEventListeners();

	    this.collapse();
	    this.activate();
	  }

	  activate () {
	    this._menu.classList.add('menu-active');
	    this._animate = true;
	  }

	  collapse () {
	    if (!this._expanded) {
	      return;
	    }
	    this._expanded = false;

	    const {x, y} = this._collapsed;
	    const invX = 1 / x;
	    const invY = 1 / y;

	    this._menu.style.transform = `scale(${x}, ${y})`;
	    this._menuContents.style.transform = `scale(${invX}, ${invY})`;

	    if (!this._animate) {
	      return;
	    }

	    this._applyAnimation({expand: false});
	  }

	  expand () {
	    if (this._expanded) {
	      return;
	    }
	    this._expanded = true;

	    this._menu.style.transform = `scale(1, 1)`;
	    this._menuContents.style.transform = `scale(1, 1)`;

	    if (!this._animate) {
	      return;
	    }

	    this._applyAnimation({expand: true});
	  }

	  toggle () {
	    if (this._expanded) {
	      this.collapse();
	      return;
	    }

	    this.expand();
	  }

	  _addEventListeners () {
	    this._menuToggleButton.addEventListener('click', this.toggle);
	  }

	  _applyAnimation ({expand}=opts) {
	    this._menu.classList.remove('method3-menu-expanded');
	    this._menu.classList.remove('method3-menu-collapsed');
	    this._menuContents.classList.remove('method3-menu-contents-expanded');
	    this._menuContents.classList.remove('method3-menu-contents-collapsed');

	    // Force a recalc styles here so the classes take hold.
	    window.getComputedStyle(this._menu).transform;

	    if (expand) {
	      this._menu.classList.add('method3-menu-expanded');
	      this._menuContents.classList.add('method3-menu-contents-expanded');
	      return;
	    }

	    this._menu.classList.add('method3-menu-collapsed');
	    this._menuContents.classList.add('method3-menu-contents-collapsed');
	  }

	  _calculateScales () {
	    const collapsed = this._menuTitle.getBoundingClientRect();
	    const expanded = this._menu.getBoundingClientRect();

	    this._collapsed = {
	      x: collapsed.width / expanded.width,
	      y: collapsed.height / expanded.height
	    }
	  }

	  _createEaseAnimations () {
	    let menuEase = document.querySelector('.menu-ease');
	    if (menuEase) {
	      return menuEase;
	    }

	    menuEase = document.createElement('style');
	    menuEase.classList.add('menu-ease');

	    const menuExpandAnimation = [];
	    const menuExpandContentsAnimation = [];
	    const menuCollapseAnimation = [];
	    const menuCollapseContentsAnimation = [];
	    for (let i = 0; i <= 100; i++) {
	      const step = this._ease(i/100);
	      const startX = this._collapsed.x;
	      const startY = this._collapsed.y;
	      const endX = 1;
	      const endY = 1;

	      // Expand animation.
	      this._append({
	        i,
	        step,
	        startX: this._collapsed.x,
	        startY: this._collapsed.y,
	        endX: 1,
	        endY: 1,
	        outerAnimation: menuExpandAnimation,
	        innerAnimation: menuExpandContentsAnimation
	      });

	      // Collapse animation.
	      this._append({
	        i,
	        step,
	        startX: 1,
	        startY: 1,
	        endX: this._collapsed.x,
	        endY: this._collapsed.y,
	        outerAnimation: menuCollapseAnimation,
	        innerAnimation: menuCollapseContentsAnimation
	      });
	    }

	    menuEase.textContent = `
	      @keyframes menuExpandAnimation {
	        ${menuExpandAnimation.join('')}
	      }

	      @keyframes menuExpandContentsAnimation {
	        ${menuExpandContentsAnimation.join('')}
	      }

	      @keyframes menuCollapseAnimation {
	        ${menuCollapseAnimation.join('')}
	      }

	      @keyframes menuCollapseContentsAnimation {
	        ${menuCollapseContentsAnimation.join('')}
	      }`;

	    document.head.appendChild(menuEase);
	    return menuEase;
	  }

	  _append ({
	        i,
	        step,
	        startX,
	        startY,
	        endX,
	        endY,
	        outerAnimation,
	        innerAnimation}=opts) {

	    const xScale = startX + (endX - startX) * step;
	    const yScale = startY + (endY - startY) * step;

	    const invScaleX = 1 / xScale;
	    const invScaleY = 1 / yScale;

	    outerAnimation.push(`
	      ${i}% {
	        transform: scale(${xScale}, ${yScale});
	      }`);

	    innerAnimation.push(`
	      ${i}% {
	        transform: scale(${invScaleX}, ${invScaleY});
	      }`);
	  }

	  _clamp (value, min, max) {
	    return Math.max(min, Math.min(max, value));
	  }

	  _ease (v, pow=4) {
	    v = this._clamp(v, 0, 1);

	    return 1 - Math.pow(1 - v, pow);
	  }
	}

	new Menu();

	class Expando {
	  constructor () {
	    this._el = document.querySelector('.js-expando');
	    this._elInner = this._el.querySelector('.js-expando-inner');
	    this._elInnerInverter = this._el.querySelector('.js-expando-inner-inverter');
	    this._expandBtn = this._el.querySelector('.js-expando-expand-btn');
	    this._collapseBtn = this._el.querySelector('.js-expando-collapse-btn');
	    this._content = this._el.querySelector('.js-content');

	    this.toggle = this.toggle.bind(this);
	    this.expand = this.expand.bind(this);
	    this.collapse = this.collapse.bind(this);

	    this._calculate();
	    this._createEaseAnimations();

	    this._expandBtn.addEventListener('click', this.expand);
	    this._collapseBtn.addEventListener('click', this.collapse);
	  }

	  expand () {
	    if (this._isExpanded) {
	      return;
	    }
	    this._isExpanded = true;
	    this._applyAnimation({expand: true});
	  }

	  collapse () {
	    if (!this._isExpanded) {
	      return;
	    }
	    this._isExpanded = false;
	    this._applyAnimation({expand: false});
	  }

	  toggle () {
	    if (this._isExpanded) {
	      return this.collapse();
	    }

	    this.expand();
	  }

	  _applyAnimation ({expand}=opts) {
	    this._elInner.classList.remove('item--expanded');
	    this._elInner.classList.remove('item--collapsed');
	    this._elInnerInverter.classList.remove('item__contents--expanded');
	    this._elInnerInverter.classList.remove('item__contents--collapsed');

	    // Force a recalc styles here so the classes take hold.
	    window.getComputedStyle(this._elInner).transform;

	    if (expand) {
	      this._elInner.classList.add('item--expanded');
	      this._elInnerInverter.classList.add('item__contents--expanded');
	      return;
	    }

	    this._elInner.classList.add('item--collapsed');
	    this._elInnerInverter.classList.add('item__contents--collapsed');
	  }

	  _calculate () {
	    const elBCR = this._el.getBoundingClientRect();
	    const collapsed = this._expandBtn.getBoundingClientRect();
	    const expanded = this._content.getBoundingClientRect();

	    const expandedWidth = Math.abs(expanded.right - elBCR.left);
	    const expandedHeight = Math.abs(expanded.bottom - elBCR.top);

	    const collapsedWidth = collapsed.width;
	    const collapsedHeight = collapsed.height;

	    const exRadius = Math.sqrt(expandedWidth * expandedWidth +
	        expandedHeight * expandedHeight);
	    const colRadius = collapsedWidth * 0.5;

	    this._scale = (exRadius - colRadius) / colRadius;

	    // Set initial sizes.
	    this._el.style.width = `${expandedWidth}px`;
	    this._el.style.height = `${expandedHeight}px`;

	    this._elInner.style.width = `${collapsedWidth}px`;
	    this._elInner.style.height = `${collapsedHeight}px`;

	    this._elInner.style.transformOrigin =
	        `${collapsedWidth * 0.5}px ${collapsedHeight * 0.5}px`;
	    this._elInnerInverter.style.transformOrigin =
	        `${collapsedWidth * 0.5}px ${collapsedHeight * 0.5}px`;

	  }

	  _createEaseAnimations () {
	    let ease = document.querySelector('.ease');
	    if (ease) {
	      return ease;
	    }

	    ease = document.createElement('style');
	    ease.classList.add('ease');

	    const expandAnimation = [];
	    const expandContentsAnimation = [];
	    const expandCircleAnimation = [];
	    const collapseAnimation = [];
	    const collapseContentsAnimation = [];
	    const collapseCircleAnimation = [];
	    for (let i = 0; i <= 100; i++) {
	      const step = this._ease(i/100);

	      // Expand animation.
	      this._append({
	        i,
	        step,
	        start: 1,
	        end: this._scale,
	        outerAnimation: expandAnimation,
	        innerAnimation: expandContentsAnimation
	      });

	      // Collapse animation.
	      this._append({
	        i,
	        step,
	        start: this._scale,
	        end: 1,
	        outerAnimation: collapseAnimation,
	        innerAnimation: collapseContentsAnimation
	      });
	    }

	    ease.textContent = `
	      @keyframes expandAnimation {
	        ${expandAnimation.join('')}
	      }

	      @keyframes expandContentsAnimation {
	        ${expandContentsAnimation.join('')}
	      }

	      @keyframes collapseAnimation {
	        ${collapseAnimation.join('')}
	      }

	      @keyframes collapseContentsAnimation {
	        ${collapseContentsAnimation.join('')}
	      }`;

	    document.head.appendChild(ease);
	    return ease;
	  }

	  _append ({
	        i,
	        step,
	        start,
	        end,
	        outerAnimation,
	        innerAnimation}=opts) {

	    const scale = start + (end - start) * step;
	    const invScale = 1 / scale;

	    outerAnimation.push(`
	      ${i}% {
	        transform: scale(${scale});
	      }`);

	    innerAnimation.push(`
	      ${i}% {
	        transform: scale(${invScale});
	      }`);
	  }

	  _clamp (value, min, max) {
	    return Math.max(min, Math.min(max, value));
	  }

	  _ease (v, pow=4) {
	    v = this._clamp(v, 0, 1);

	    return 1 - Math.pow(1 - v, pow);
	  }
	}

	new Expando();
})();