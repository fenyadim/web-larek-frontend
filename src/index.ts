import { AppApi } from './components/app-api';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { CartData } from './components/cart-data';
import { Catalog } from './components/catalog';
import { Modal } from './components/common/modal';
import { ProductCard } from './components/product-card';
import { ProductsData } from './components/products-data';
import { UserData } from './components/user-data';
import { IApi } from './types';
import { API_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';
import './scss/styles.scss';

const events = new EventEmitter();

const baseApi: IApi = new Api(API_URL);
const api = new AppApi(baseApi);

const productsData = new ProductsData(events);
const cartData = new CartData(events);
const userData = new UserData(events);

const cardCatalogTemplate: HTMLTemplateElement =
	document.querySelector('#card-catalog');

const cardFullTemplate: HTMLTemplateElement =
	document.querySelector('#card-preview');

const modalContainer = new Modal(
	document.querySelector('#modal-container'),
	events
);

const galleryContainer = new Catalog(document.querySelector('.gallery'));

events.onAll((event) => {
	console.log(event.eventName, event.data);
});

Promise.resolve(api.getProducts())
	.then((products) => {
		productsData.products = products.items;
		events.emit('initialData:loaded');
	})
	.catch((err) => {
		console.log('ERROR');
		console.error(err);
	});

events.on('initialData:loaded', () => {
	const cardsArray = productsData.products.map((card) => {
		const cardInstance = new ProductCard(
			cloneTemplate(cardCatalogTemplate),
			events
		);
		return cardInstance.render(card);
	});

	galleryContainer.render({ catalog: cardsArray });
});

events.on('productModal:open', (data: { product: ProductCard }) => {
	const { product } = data;
	const card = productsData.getOneProduct(product.id);
	const cardInstance = new ProductCard(cloneTemplate(cardFullTemplate), events);
	modalContainer.render({ children: cardInstance.render(card) });
});
