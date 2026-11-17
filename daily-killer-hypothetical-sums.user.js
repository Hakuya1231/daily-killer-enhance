// ==UserScript==
// @name         Daily Killer Sudoku Assumed Sums
// @namespace    daily-killer-enhance
// @version      1.3.0
// @description  Add assumed sums to unlabeled cages and show their candidates in Combinations.
// @match        https://www.dailykillersudoku.com/puzzle/*
// @match        https://www.dailykillersudoku.com/m/puzzle/*
// @run-at       document-idle
// @inject-into  page
// @grant        none
// @noframes
// ==/UserScript==

(() => {
    'use strict';

    const puzzleId = location.pathname.match(/^\/(?:m\/)?puzzle\/(\d+)\/?$/)?.[1];
    const boardElement = document.getElementById('puzzleBoard');
    if (!puzzleId || !boardElement) return;

    // The site unpacks board_base64 and creates the canvas when the player is ready.
    const ready = new MutationObserver(installWhenReady);
    ready.observe(boardElement, { childList: true, subtree: true });
    installWhenReady();

    function installWhenReady() {
        const site = window.DKS;
        const puzzle = site?.puzzle;
        if (!puzzle?.board || !boardElement.querySelector('.puzzle-canvas')) return;
        ready.disconnect();
        if (String(puzzle.id()) === puzzleId && puzzle.board.size === 9 &&
            puzzle.board._cages?.some(cage => cage.sum === 0)) {
            install(site, puzzle);
        }
    }

    function install(site, puzzle) {
        const board = puzzle.board;
        const cages = board._cages;
        const cageIds = new Map(cages.map((cage, id) => [cage, id]));
        const combinations = document.getElementById('puzzleCombinations');
        const storagePrefix = `daily-killer-enhance:sum:${puzzleId}:`;
        const sums = new Map();
        const assumedCombinations = new Map();
        let currentCage = null;
        let previousSelection = [];
        let replaceValue = true;

        const panel = document.createElement('section');
        panel.id = 'dke-sum-panel';
        panel.className = 'controls-container sm-puzzle-menu';
        panel.lang = 'en';
        panel.setAttribute('aria-labelledby', 'dke-sum-title');
        panel.innerHTML = `
            <header><h2><button type="button" aria-label="Assumed Sum">Assume</button></h2></header>
            <form class="controls-inner">
                <label id="dke-sum-title" for="dke-sum-value">Assumed Sum <small id="dke-cage-size"></small></label>
                <input id="dke-sum-value" type="text" class="calculator-input" inputmode="none"
                       autocomplete="off" aria-describedby="dke-sum-status">
                <div class="dke-keypad" role="group" aria-label="Assumed sum keypad">
                    ${Array.from('123456789', digit =>
                        `<button type="button" class="dke-key" data-key="${digit}">${digit}</button>`).join('')}
                    <button type="button" class="dke-key" data-key="0">0</button>
                    <button type="button" class="dke-key" data-key="Backspace" aria-label="Backspace">⌫</button>
                </div>
                <div class="dke-actions">
                    <button type="submit" class="dke-key">Save</button>
                    <button id="dke-sum-clear" type="button" class="dke-key" aria-label="Clear assumed sum">Clear</button>
                </div>
                <output id="dke-sum-status" role="status"></output>
            </form>`;
        const editor = panel.querySelector('form');
        const input = panel.querySelector('input');
        const sizeLabel = panel.querySelector('#dke-cage-size');
        const clearButton = panel.querySelector('#dke-sum-clear');
        const status = panel.querySelector('output');
        const keys = panel.querySelectorAll('[data-key]');
        const editableControls = panel.querySelectorAll('form input, form button:not(#dke-sum-clear)');
        const compactTabs = window.matchMedia('(max-width: 767.97px)');
        document.getElementById('puzzleSmallMenu').before(panel);
        puzzle._tabs.add(window.$(panel), {
            onTabVisible() {},
            onTabHidden() { input.blur(); },
        });

        const markers = document.createElement('div');
        markers.className = 'dke-sum-markers';
        boardElement.querySelector('.puzzle-board').append(markers);
        const style = document.createElement('style');
        style.textContent = `
            #dke-sum-panel {
                display: block; box-sizing: border-box; padding: .5em;
            }
            #dke-sum-panel > header { display: none; }
            #dke-sum-panel > form.controls-inner {
                display: grid; grid-template-columns: minmax(0, 1fr) minmax(42px, .58fr);
                grid-template-rows: auto minmax(0, 1fr) auto; gap: 4px 6px;
                height: 100%; padding: 4px; color: #fff; overflow: auto;
            }
            #dke-sum-title {
                align-self: center; margin: 0; color: #fff;
                font-weight: bold; font-size: clamp(13px, 3.7vmin, 18px);
            }
            #dke-cage-size { color: #fff; font-size: .72em; font-weight: normal; white-space: nowrap; }
            #dke-sum-value.calculator-input {
                width: 100%; height: 26px; padding: 0 3px; margin: 0;
                font-size: 16px; text-align: center; box-sizing: border-box;
            }
            #dke-sum-panel .dke-keypad, #dke-sum-panel .dke-actions {
                display: grid; gap: 1px; min-height: 0;
            }
            #dke-sum-panel .dke-keypad {
                grid-template-columns: repeat(3, minmax(0, 1fr));
                grid-template-rows: repeat(4, minmax(18px, 1fr));
            }
            #dke-sum-panel [data-key="Backspace"] { grid-column: span 2; }
            #dke-sum-panel .dke-actions { grid-template-rows: repeat(2, minmax(28px, 1fr)); }
            #dke-sum-panel .dke-key {
                border: 0; border-radius: .18em; padding: 0; min-width: 0;
                background: inherit; box-shadow: inset 0 0 0 1px rgba(255,255,255,.1);
                color: #d4dde0; font: inherit; font-size: clamp(12px, 3.6vmin, 16px);
                line-height: 1; cursor: pointer;
            }
            #dke-sum-panel .dke-key:active { background: rgba(255,255,255,.12); }
            #dke-sum-panel .dke-key:disabled { opacity: .45; cursor: default; }
            #dke-sum-status { grid-column: 1 / -1; font-size: 12px; color: #d4dde0; }
            #dke-sum-status:empty { display: none; }

            html.desktop-layout #dke-sum-panel { top: 0; right: 0; width: 200px; height: 166px; }
            html.desktop-layout .puzzle-page-container > #puzzleCombinations { top: 176px; height: 134px; }
            html.desktop-layout #puzzleCombinations > .controls-inner { overflow: auto; }
            @media (min-width: 1500px) {
                html.desktop-layout #dke-sum-panel { width: 240px; }
            }
            @media (max-width: 767.97px) {
                html.touchscreen-layout .content .puzzle-page-container
                    > :is(#puzzleCombinations, #puzzleCalculator, #dke-sum-panel, #puzzleSmallMenu)
                    > header { height: 25%; }
                html.touchscreen-layout .content #puzzleCombinations > header { top: 0; }
                html.touchscreen-layout .content #puzzleCalculator > header { top: 25%; }
                html.touchscreen-layout .content #dke-sum-panel > header { display: block; top: 50%; }
                html.touchscreen-layout .content #puzzleSmallMenu > header { top: 75%; }
                #dke-sum-panel > header button {
                    border: 0; padding: 0; width: 100%; height: 100%;
                    background: transparent; color: inherit; font: inherit;
                    writing-mode: inherit; text-orientation: inherit; text-shadow: inherit;
                }
                #dke-sum-panel:not(.active) > form { visibility: hidden; }
                html.touchscreen-layout .content #dke-sum-panel > form.controls-inner { padding: 4px; }
            }
            @media (min-width: 768px) and (orientation: landscape) {
                html.touchscreen-layout #dke-sum-panel {
                    top: 0; right: 25%; width: 22%; height: 142px;
                }
            }
            @media (min-width: 768px) and (orientation: portrait) {
                html.touchscreen-layout #dke-sum-panel {
                    top: 0; left: 70%; width: 30%; height: calc(30% - 8px);
                }
            }
            #puzzleBoard .dke-sum-markers {
                position: absolute; inset: 0; z-index: 2; pointer-events: none;
                container-type: inline-size;
            }
            .dke-sum-markers span {
                position: absolute; border-radius: .2em; padding: 0 .18em;
                color: #351d00; background: #ffd36f;
                font: bold 11px/1.05 system-ui, sans-serif;
                font-size: clamp(8px, 2.8cqw, 22px);
            }`;
        document.head.append(style);

        const { PUZZLE_BORDER_SIZE, PUZZLE_BOARD_SIZE,
            PUZZLE_CANVAS_SIZE, PUZZLE_CAGE_MARGIN } = site.Constants;

        function restoreSum(cage, raw) {
            const value = Number(raw);
            if (raw != null && raw !== '' && Number.isSafeInteger(value) && value >= 0) {
                if (sums.get(cage) === value) return;
                sums.set(cage, value);
            } else {
                sums.delete(cage);
            }
            assumedCombinations.delete(cage);
        }

        for (const [cage, id] of cageIds) {
            if (cage.sum !== 0) continue;
            try {
                restoreSum(cage, localStorage.getItem(storagePrefix + id));
            } catch {
                break;
            }
        }

        function drawMarkers() {
            markers.replaceChildren();
            for (const [cage, sum] of sums) {
                const { row, column } = cage.getCellThatWouldHoldSum();
                const origin = PUZZLE_BORDER_SIZE + PUZZLE_CAGE_MARGIN;
                const cellSize = PUZZLE_BOARD_SIZE / board.size;
                const badge = document.createElement('span');
                badge.textContent = sum;
                badge.title = `Assumed sum: ${sum}`;
                badge.style.left = `${100 * (origin + column * cellSize) / PUZZLE_CANVAS_SIZE}%`;
                badge.style.top = `${100 * (origin + row * cellSize) / PUZZLE_CANVAS_SIZE}%`;
                markers.append(badge);
            }
        }

        function updateEditor(cage, refresh = false) {
            if (cage === currentCage && !refresh) return;
            currentCage = cage;
            input.value = sums.get(cage) ?? '';
            replaceValue = true;
            for (const control of editableControls) control.disabled = !cage;
            clearButton.disabled = !sums.has(cage);
            const size = cage?.cells.length;
            sizeLabel.textContent = size ? `${size} ${size === 1 ? 'cell' : 'cells'}` : '';
            status.textContent = '';
        }

        function openEditorForSingleCell() {
            if (currentCage && board.highlightedCells.length === 1 &&
                compactTabs.matches && document.documentElement.classList.contains('touchscreen-layout')) {
                activateTab(panel);
            }
        }

        function activateTab(panel) {
            if (!panel.classList.contains('active')) panel.querySelector('header').click();
        }

        // Keep the native selection and use its Combinations renderer. The site's
        // cage.sum stays untouched so assumptions never affect puzzle validation.
        const nativeCombinations = puzzle._updateCombinationsListBasedOnHighlightedCells;
        puzzle._updateCombinationsListBasedOnHighlightedCells = function () {
            const cells = board.highlightedCells;
            const cursorCage = board._currentCursor?.cage;
            const editable = cells.length && cursorCage?.sum === 0 ? cursorCage : null;
            const newSelection = cells.length !== previousSelection.length ||
                cells.some((cell, index) => cell !== previousSelection[index]);
            if (newSelection) previousSelection = [...cells];
            updateEditor(editable);
            if (newSelection) openEditorForSingleCell();

            const selectedCages = new Set(cells.map(cell => cell.cage));
            if (selectedCages.size === 1 && sums.has(cursorCage)) {
                if (!assumedCombinations.has(cursorCage)) {
                    assumedCombinations.set(cursorCage, new site.Combinations(
                        sums.get(cursorCage), cursorCage.cells.length, board.size,
                    ));
                }
                return this._combinations.setCombinations(assumedCombinations.get(cursorCage));
            }
            if (selectedCages.size < 2 || ![...selectedCages].some(cage => cage.sum === 0)) {
                if (!cells.length) this._combinations.clear();
                return nativeCombinations.call(this);
            }

            const selected = new Set(cells);
            let total = 0;
            for (const cage of selectedCages) {
                if (cage.cells.every(cell => selected.has(cell))) {
                    total += cage.sum || sums.get(cage) || 0;
                }
            }
            if (total) {
                this._combinations.displaySum(total);
                if (newSelection && !this._isInCalculatorMode && this._combinations._isVisible) {
                    activateTab(combinations);
                }
            } else {
                this._combinations.clear();
            }
        };

        const canvas = boardElement.querySelector('.puzzle-canvas');
        for (const type of ['mousedown', 'touchstart']) {
            canvas.addEventListener(type, () => {
                input.blur();
                openEditorForSingleCell();
            });
            panel.addEventListener(type, event => event.stopPropagation());
        }
        for (const type of ['keydown', 'keyup']) {
            editor.addEventListener(type, event => event.stopPropagation());
        }
        input.addEventListener('focus', () => {
            if (replaceValue) input.select();
        });
        input.addEventListener('input', () => {
            input.value = input.value.replace(/[^0-9]/g, '');
            replaceValue = false;
            status.textContent = '';
        });
        for (const key of keys) {
            key.addEventListener('mousedown', event => event.preventDefault());
            key.addEventListener('click', () => {
                const digit = key.dataset.key;
                const focused = document.activeElement === input;
                const start = focused ? input.selectionStart : input.value.length;
                const end = focused ? input.selectionEnd : input.value.length;
                if (digit === 'Backspace') {
                    input.setRangeText('', start === end ? Math.max(0, start - 1) : start, end, 'end');
                } else if (replaceValue) {
                    input.value = digit;
                    input.setSelectionRange(1, 1);
                } else {
                    input.setRangeText(digit, start, end, 'end');
                }
                replaceValue = false;
                status.textContent = '';
            });
        }

        function persist(cage, sum) {
            const key = storagePrefix + cageIds.get(cage);
            try {
                if (sum == null) localStorage.removeItem(key);
                else localStorage.setItem(key, String(sum));
            } catch {
                status.textContent = 'Browser storage is unavailable.';
                return;
            }
            restoreSum(cage, sum);
            updateEditor(currentCage, true);
            drawMarkers();
            if (editor.contains(document.activeElement)) document.activeElement.blur();
            puzzle.focus();
            puzzle._updateCombinationsListBasedOnHighlightedCells();
        }

        editor.addEventListener('submit', event => {
            event.preventDefault();
            if (!currentCage || !input.value) return;
            const sum = Number(input.value);
            if (Number.isSafeInteger(sum)) persist(currentCage, sum);
        });
        clearButton.addEventListener('click', () => {
            if (currentCage && sums.has(currentCage)) persist(currentCage, null);
        });
        window.addEventListener('storage', event => {
            if (!event.key?.startsWith(storagePrefix) || event.storageArea !== localStorage) return;
            const cage = cages[Number(event.key.slice(storagePrefix.length))];
            if (cage?.sum !== 0) return;
            restoreSum(cage, event.newValue);
            if (currentCage === cage) updateEditor(cage, true);
            drawMarkers();
            puzzle._updateCombinationsListBasedOnHighlightedCells();
        });

        updateEditor(null, true);
        drawMarkers();
        puzzle._updateCombinationsListBasedOnHighlightedCells();
    }
})();
