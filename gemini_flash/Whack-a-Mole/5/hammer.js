class Hammer {
    constructor() {
        this.element = document.createElement('div');
        this.element.classList.add('hammer');
        this.element.style.backgroundImage = `url(${hammerImage.src})`;
        this.element.style.position = 'absolute';
        this.element.style.bottom = '20px';
        this.element.style.left = '50%';
        this.element.style.transform = 'translateX(-50%)';
        this.element.style.cursor = 'pointer';
        this.isHitting = false;
    }

    hit(target = null) {
        if (this.isHitting) return;
        this.isHitting = true;
        this.element.style.transition = 'transform 0.2s ease';
        this.element.style.transform = 'translateX(-50%) translateY(-50px)';
        setTimeout(() => {
            this.element.style.transition = 'transform 0.2s ease';
            this.element.style.transform = 'translateX(-50%) translateY(0px)';
            this.isHitting = false;
            if (target) {
                // 锤子击中地鼠效果
                target.style.visibility = 'hidden';
            }
        }, 200);
    }
}

export { Hammer };