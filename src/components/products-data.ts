import { IEvents } from '../components/base/events';
import { IProduct, IProductsData } from '../types';

export class ProductsData implements IProductsData {
	protected _products: IProduct[];
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	set products(products: IProduct[]) {
		this._products = products;
		this.events.emit('products:changed');
	}

	get products() {
		return this._products;
	}

	getOneProduct(id: string) {
		return this._products.find((product) => product.id === id);
	}
}
