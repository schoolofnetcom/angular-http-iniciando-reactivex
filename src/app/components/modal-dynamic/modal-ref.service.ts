import {ApplicationRef, ComponentRef, Injectable} from '@angular/core';
import {ModalDynamicComponent} from './modal-dynamic/modal-dynamic.component';

@Injectable()
export class ModalRefService {

    instance: ModalDynamicComponent;

    context: any;

    appRef: ApplicationRef;

    constructor() {
    }

    show(eventData = null) {
        this.instance.show(eventData);
    }

    hide(eventData = null) {
        this.instance.hide(eventData);
    }

    set componentRef(compRef: ComponentRef<ModalDynamicComponent>) {
        const instance = compRef.instance;
        const subscriber = instance.onHide.subscribe(() => {
            setTimeout(() => {
                instance.dispose();
                this.appRef.detachView(compRef.hostView);
                compRef.destroy();
                subscriber.unsubscribe();
            }, 3000);

        });
    }

    get onShow() {
        return this.instance.onShow;
    }

    get onHide() {
        return this.instance.onHide;
    }
}
