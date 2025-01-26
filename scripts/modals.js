class Modal {
    constructor(message = '', confirmBtn = {}) {
        this.message = message;
        this.parent = document.body;
        this.modal = null;
        this.confirmBtn = confirmBtn;
        this.confirmLabel = confirmBtn.label || 'OK';
        this.createModal();
    }

    answer() {
        return new Promise((resolve, reject) => {
            if (!this.modal) {
                reject('Error creating modal');
                return;
            }

            // Handle modal overlay and button clicks
            this.modal.addEventListener('click', event => {
                if (event.target.classList.contains('modal-container')) {
                    this.handleConfirm(resolve, event);
                }
            });

            const confirmBtn = this.modal.querySelector('.modal button');
            confirmBtn.addEventListener('click', event => this.handleConfirm(resolve, event));
        });
    }

    handleConfirm(resolve, event) {
        resolve();
        if (this.confirmBtn.clickHandler) {
            this.confirmBtn.clickHandler(event);
        }
        this.removeModal();
    }

    createModal() {
        this.modal = this.createModalMarkup();
        this.parent.insertAdjacentElement('afterbegin', this.modal);
        this.fadeIn();
    }

    removeModal() {
        this.fadeOut();
        this.sleep(200).then(() => {
            if (this.modal?.parentElement) {
                this.parent.removeChild(this.modal);
            }
            this.modal = null;
        });
    }

    fadeIn() {
        this.sleep(100).then(() => {
            this.modal.classList.add('modal--active');
        });
    }

    fadeOut() {
        this.modal.classList.remove('modal--active');
    }

    sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    createModalMarkup() {
        const modal = document.createElement('div');
        modal.className = 'modal-container';
        modal.innerHTML = `
            <div class="modal">
                <p>${this.message}</p>
                <button>${this.confirmLabel}</button>
            </div>`;
        console.log(`Modal message: ${this.message}`);
        return modal;
    }
}
