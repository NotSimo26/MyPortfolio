// header-animator.js

const words = ["Simo", "@SimoDevv", "@simo2601"];
const target = document.querySelector("header h1");
let wordIndex = 0;
const INVISIBLE_CHAR = "\u200B";
const CURSOR_CHAR = "|";

function sleep(s) {
    return new Promise(resolve => setTimeout(resolve, s*1000));
}

async function animateTextChange() {
    while (true) {
        const current = words[wordIndex];
        const next = words[(wordIndex + 1) % words.length];

        // Cancella le lettere una alla volta
        for (let i = current.length; i >= 0; i--) {
            target.innerHTML = `<span class="typing-text">${i === 0 ? INVISIBLE_CHAR : current.slice(0, i)}</span><span class="cursor">${CURSOR_CHAR}</span>`;
            await sleep(0.2);
        }

        await sleep(0.5);

        // Scrive le lettere una alla volta
        for (let i = 1; i <= next.length; i++) {
            target.innerHTML = `<span class="typing-text">${next.slice(0, i)}</span><span class="cursor">${CURSOR_CHAR}</span>`;
            await sleep(0.2);
        }

        await sleep(4);
        wordIndex = (wordIndex + 1) % words.length;
    }
}

document.addEventListener("DOMContentLoaded", animateTextChange);
