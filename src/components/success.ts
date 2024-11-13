import { Component } from '../components/base/component';
import { IEvents } from '../components/base/events';

export class Success extends Component<unknown> {
	protected events: IEvents;
	protected _totalPrice: HTMLElement;
	protected successButton: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.successButton = this.container.querySelector('.order-success__close');
		this._totalPrice = this.container.querySelector(
			'.order-success__description'
		);
		this.successButton.addEventListener('click', () => {
			this.events.emit('successModal:close');
		});
	}

	set totalPrice(totalPrice: number) {
		this._totalPrice.textContent = `Списано ${totalPrice} синапсов`;
	}
}
