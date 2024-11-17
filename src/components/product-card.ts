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
	protected addToCartButton: HTMLButtonElement;
	protected _basketIndex: HTMLElement;
	protected cardId: string;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.cardTitle = this.container.querySelector('.card__title');
		this.cardText = this.container.querySelector('.card__text');
		this.cardImage = this.container.querySelector('.card__image');
		this.cardPrice = this.container.querySelector('.card__price');
		this.cardCategory = this.container.querySelector('.card__category');
		this.addToCartButton = this.container.querySelector('.card__button');
		this._basketIndex = this.container.querySelector('.basket__item-index');

		if (container.nodeName === 'BUTTON')
			container.addEventListener('click', () => {
				this.events.emit('productModal:open', { product: this });
			});

		if (this.addToCartButton)
			this.addToCartButton.addEventListener('click', () => {
				if (this.addToCartButton.ariaLabel) {
					this.addToCartButton.removeAttribute('aria-label');
					this.addToCartButton.textContent = 'В корзину';
					this.events.emit('basket-item:delete', { product: this });
				} else {
					this.addToCartButton.setAttribute('aria-label', 'удалить');
					this.addToCartButton.textContent = 'Убрать';
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

	set basketIndex(id: number) {
		if (this._basketIndex) this._basketIndex.textContent = String(id);
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
			if (this.addToCartButton) {
				this.addToCartButton.disabled = true;
			}
		} else this.cardPrice.textContent = `${price} синапсов`;
	}

	hasInCart() {
		this.addToCartButton.textContent = 'Убрать';
		this.addToCartButton.setAttribute('aria-label', 'удалить');
	}

	set id(id: string) {
		this.cardId = id;
	}

	get id() {
		return this.cardId;
	}
}
