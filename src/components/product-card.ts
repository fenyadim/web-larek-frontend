import { Component } from '../components/base/component';
import { IEvents } from '../components/base/events';
import { IProduct } from '../types';
import { CDN_URL } from '../utils/constants';

type Categories =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

export class ProductCard extends Component<IProduct> {
	protected events: IEvents;
	protected cardTitle: HTMLElement;
	protected cardText: HTMLElement;
	protected cardImage: HTMLImageElement;
	protected cardPrice: HTMLElement;
	protected cardCategory: HTMLElement;
	protected cardContainerButton: HTMLElement;
	protected addToCartButton: HTMLButtonElement;
	protected cardId: string;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.cardTitle = this.container.querySelector('.card__title');
		this.cardText = this.container.querySelector('.card__text');
		this.cardImage = this.container.querySelector('.card__image');
		this.cardPrice = this.container.querySelector('.card__price');
		this.cardCategory = this.container.querySelector('.card__category');
		this.addToCartButton = this.container.querySelector('.card__button');

		if (container.nodeName === 'BUTTON')
			container.addEventListener('click', () => {
				this.events.emit('productModal:open', { product: this });
			});

		if (this.addToCartButton)
			this.addToCartButton.addEventListener('click', () => {
				if (this.addToCartButton.ariaLabel) {
					this.events.emit('basket-item:delete', { product: this });
				} else {
					this.events.emit('basket-item:add', { product: this });
				}
			});
	}

	set title(title: string) {
		this.cardTitle.textContent = title;
	}

	set description(text: string) {
		if (this.cardText) this.cardText.textContent = text;
	}

	set image(image: string) {
		if (this.cardImage) this.cardImage.src = `${CDN_URL}${image}`;
	}

	set category(category: Categories) {
		if (this.cardCategory) {
			const styleCategory: Record<Categories, string> = {
				'софт-скил': 'card__category_soft',
				другое: 'card__category_other',
				дополнительное: 'card__category_additional',
				кнопка: 'card__category_button',
				'хард-скил': 'card__category_hard',
			};
			this.cardCategory.className = 'card__category ' + styleCategory[category];
			this.cardCategory.textContent = category;
		}
	}

	set price(price: number) {
		if (price === null) {
			this.cardPrice.textContent = 'Бесценно';
		} else this.cardPrice.textContent = `${price} синапсов`;
	}

	set titleBuyButton(title: string) {
		this.addToCartButton.textContent = title;
		this.addToCartButton.setAttribute('aria-label', 'удалить');
	}

	set id(id: string) {
		this.cardId = id;
	}

	get id() {
		return this.cardId;
	}
}
