import { IEvents } from '../components/base/events';
import { Component } from './base/component';

interface IBasket {
	catalog: HTMLElement[];
	totalPrice: number;
}

export class Basket extends Component<IBasket> {
	protected events: IEvents;
	protected catalogCard: HTMLElement;
	protected totalPriceElement: HTMLElement;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.catalogCard = this.container.querySelector('.basket__list');
		this.totalPriceElement = this.container.querySelector('.basket__price');
	}

	set catalog(catalog: HTMLElement[]) {
		this.catalogCard.replaceChildren(...catalog);
	}

	set totalPrice(totalPrice: number) {
		this.totalPriceElement.textContent = `${totalPrice} синапсов`;
	}
}
