class Item {
    constructor(id, imageSrc, useCallback) {
        this.id = id;
        this.element = document.createElement('div');
        this.element.classList.add('item');
        this.element.style.backgroundImage = `url(${imageSrc})`;
        this.element.style.position = 'absolute';
        this.element.style.bottom = '20px';
        this.element.style.left = '50%';
        this.element.style.transform = 'translateX(-50%)';
        this.element.style.cursor = 'pointer';
        this.element.dataset.itemId = id;
        this.useCallback = useCallback;
    }

    use() {
        this.useCallback();
    }
}

export { Item };