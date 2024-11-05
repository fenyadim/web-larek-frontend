import { IEvents } from '../components/base/events';
import { ICartData, IProduct, TProductCart } from '../types';

export class CartData implements ICartData {
	protected _cart: TProductCart[];
	protected _totalPrice: number;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
		this._cart = [];
		this._totalPrice = 0;
	}

	set cart(cart: TProductCart[]) {
		this._cart = cart;
		this.events.emit('basket:changed', cart);
	}

	get cart() {
		return this._cart;
	}

	get totalPrice() {
		return this._totalPrice;
	}

	add(product: IProduct) {
		this._cart.push(product);
		this._totalPrice += product.price || 0;
		this.events.emit('basket:changed', this._cart);
	}

	remove(productId: string) {
		const findArr = this._cart.find((product) => product.id === productId);
		if (findArr) {
			this._totalPrice -= findArr.price || 0;
			this._cart = this._cart.filter((product) => product.id !== productId);
			this.events.emit('basket:changed', this._cart);
		}
	}

	clear() {
		this._cart = [];
		this._totalPrice = 0;
		this.events.emit('basket:changed', this._cart);
	}
}
