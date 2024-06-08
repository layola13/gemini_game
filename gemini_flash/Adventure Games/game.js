const startButton = document.getElementById('start-button');
const gameScreen = document.getElementById('game-screen');
const gameOptions = document.getElementById('game-options');

startButton.addEventListener('click', () => {
    gameScreen.innerHTML = `
        <h2>你站在一个岔路口，面前有两条路：</h2>
        <ul>
            <li><button id="path-1">向左走</button></li>
            <li><button id="path-2">向右走</button></li>
        </ul>
    `;

    const path1Button = document.getElementById('path-1');
    const path2Button = document.getElementById('path-2');

    path1Button.addEventListener('click', () => {
        // 向左走的场景逻辑
        gameScreen.innerHTML = `
            <h2>你选择了向左走，来到了一片森林。</h2>
            <p>你看到了一个古老的树洞，里面似乎有东西在闪光。</p>
            <ul>
                <li><button id="explore-tree">探索树洞</button></li>
                <li><button id="leave-forest">离开森林</button></li>
            </ul>
        `;

        // ... 添加更多场景逻辑 ...
    });

    path2Button.addEventListener('click', () => {
        // 向右走的场景逻辑
        gameScreen.innerHTML = `
            <h2>你选择了向右走，来到了一条河流。</h2>
            <p>河边有一座小木桥，看起来有些年久失修。</p>
            <ul>
                <li><button id="cross-bridge">过桥</button></li>
                <li><button id="turn-back">折返回去</button></li>
            </ul>
        `;

        // ... 添加更多场景逻辑 ...
    });
});