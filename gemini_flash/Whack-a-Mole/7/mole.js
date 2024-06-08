class Mole {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.element = document.createElement('div');
        this.element.classList.add('mole');
        this.element.style.gridRow = `${row + 1} / ${row + 2}`;
        this.element.style.gridColumn = `${col + 1} / ${col + 2}`;
        this.element.style.backgroundImage = `url(${holeImage.src})`; // 使用地洞图片
        this.isUp = false;
        this.element.addEventListener('click', () => {
            this.hide();
        });
    }

    appear() {
        this.element.style.backgroundImage = `url(${moleImage.src})`; // 显示地鼠图片
        this.element.style.visibility = 'visible';
        this.isUp = true;
    }

    hide() {
        this.element.style.backgroundImage = `url(${holeImage.src})`; // 恢复地洞图片
        this.element.style.visibility = 'hidden';
        this.isUp = false;
    }
}

export { Mole };