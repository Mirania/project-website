class Chatbox {
    #div: HTMLDivElement;
    #opacity: number;
    #targetOpacity: number;
    #activeRoutine: NodeJS.Timeout;
    isActive: boolean;

    constructor(div: Element, targetOpacity: number) {
        this.#div = div as HTMLDivElement;
        this.#opacity = 0;
        this.#div.style.opacity = "0%";
        this.#targetOpacity = targetOpacity;
        this.isActive = false;
    }

    show(text: string): void {
        if (this.isActive) return;

        this.isActive = true;
        this.#div.innerHTML = text;

        if (this.#activeRoutine !== undefined)
            clearInterval(this.#activeRoutine);

        this.#activeRoutine = setInterval(() => {
            if (this.#opacity < this.#targetOpacity) {
                this.#opacity += 2;
                this.#div.style.opacity = `${this.#opacity}%`;
            } else {
                clearInterval(this.#activeRoutine);
                this.#activeRoutine = undefined;
            }
        }, 1 / 60 * 1000)
    }

    hide(): void {
        if (!this.isActive) return;

        this.isActive = false;

        if (this.#activeRoutine !== undefined)
            clearInterval(this.#activeRoutine);

        this.#activeRoutine = setInterval(() => {
            if (this.#opacity > 0) {
                this.#opacity -= 2;
                this.#div.style.opacity = `${this.#opacity}%`;
            } else {
                clearInterval(this.#activeRoutine);
                this.#activeRoutine = undefined;
            }
        }, 1 / 60 * 1000)
    }

    hideImmediately(): void {
        if (!this.isActive) return;

        if (this.#activeRoutine !== undefined) {
            clearInterval(this.#activeRoutine);
            this.#activeRoutine = undefined;
        }

        this.isActive = false;
        this.#opacity = 0;
        this.#div.style.opacity = "0%";
    }
}