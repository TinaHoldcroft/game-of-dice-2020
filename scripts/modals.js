class Modal {
    constructor(message = '', confirmBtn = {}) {
        this.message = message;
        this.parent = document.body;
        this.modal = undefined;
        this.confirmBtn = confirmBtn;
        this.confirmLabel = confirmBtn.label || 'OK';
        this.createModal();}

    answer() {
        const confirmBtn = this.modal.querySelector('.modal');
        return new Promise((resolve, reject) => {
            if (!this.modal) {
                reject('Error creating modal'); }
                this.modal.addEventListener('click', event => {
                    if (event.target.className !== 'modal__background modal__background-active') { return; }
                    resolve();
                    if (this.clickHandler) { this.removeModal(); } 
                    else if (this.confirmBtn.clickHandler) {
                        this.confirmBtn.clickHandler(event);
                        this.removeModal();} 
                    else { this.removeModal(); } });
            confirmBtn.addEventListener('click', event => {
                resolve();
                if (this.confirmBtn.clickHandler) { this.confirmBtn.clickHandler(event); }
                this.removeModal(); }); }); }

    createModal() {
        this.createModalMarkup();
        this.parent.insertAdjacentElement('afterbegin', this.modal);
        this.sleep(100).then(() => this.fadeIn()); } 
    
    removeModal() {
        this.fadeOut();
        this.sleep(200).then(() => {
            this.parent.removeChild(this.modal);
            delete this; }); }
    
    sleep(miliseconds) { return new Promise(resolve => setTimeout(resolve, miliseconds)); }

    fadeIn() {
        this.modal.classList.add('modal__background-active');
        this.parent.style.overflow = 'hidden'; }

    fadeOut() {
        this.modal.classList.remove('modal__background-active');
        this.parent.removeAttribute('style'); }

    createModalMarkup() {
        this.modal = document.createElement('div');
        this.modal.className = 'modal__background';
        this.modal.addEventListener('click', this.onModalOverlayClick);
        this.modal.innerHTML = `
            <div class="modal">
                <p>${this.message}</p>
                <button>${this.confirmLabel}</button>
            </div>`;
        console.log(`Modal message: ${this.message}`) } }