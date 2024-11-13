import { AppApi } from './components/app-api';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/basket';
import { CartData } from './components/cart-data';
import { Catalog } from './components/catalog';
import { Modal } from './components/common/modal';
import { Form } from './components/form';
import { ProductCard } from './components/product-card';
import { ProductsData } from './components/products-data';
import { Success } from './components/success';
import { UserData } from './components/user-data';
import { IApi, IUser } from './types';
import { API_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';
import './scss/styles.scss';

const events = new EventEmitter();

const baseApi: IApi = new Api(API_URL);
const api = new AppApi(baseApi);

const productsData = new ProductsData(events);
const cartData = new CartData(events);
const userData = new UserData(events);

const basketButton: HTMLButtonElement =
	document.querySelector('.header__basket');

const counterBasket: HTMLElement = document.querySelector(
	'.header__basket-counter'
);

const cardCatalogTemplate: HTMLTemplateElement =
	document.querySelector('#card-catalog');
const cardFullTemplate: HTMLTemplateElement =
	document.querySelector('#card-preview');
const cardBasketTemplate: HTMLTemplateElement =
	document.querySelector('#card-basket');

const basketTemplate: HTMLTemplateElement = document.querySelector('#basket');
const orderTemplate: HTMLTemplateElement = document.querySelector('#order');
const contactsTemplate: HTMLTemplateElement =
	document.querySelector('#contacts');
const successTemplate: HTMLTemplateElement = document.querySelector('#success');

const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Form(cloneTemplate(orderTemplate), events);
const contacts = new Form(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

const modalContainer = new Modal(
	document.querySelector('#modal-container'),
	events
);

const galleryContainer = new Catalog(document.querySelector('.gallery'));

basketButton.addEventListener('click', () => {
	events.emit('basketModal:open');
});

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

function validation(form: Form) {
	const inputValues = form.getInputValues();
	if (Object.values(inputValues).includes('')) {
		form.valid = false;
		form.error = {
			validInfo: 'Заполните все поля',
		};
	} else {
		form.valid = true;
		form.error = {
			validInfo: '',
		};
	}
}

function submitEvent(name: string, data: IUser) {
	userData.update(data);
	events.emit(name);
}

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
	if (cartData.cart.find((product) => product.id === card.id)) {
		cardInstance.hasInCart = true;
	}
	modalContainer.render({ children: cardInstance.render(card) });
});

events.on('basket-item:add', (data: { product: ProductCard }) => {
	const { product } = data;
	const card = productsData.getOneProduct(product.id);
	cartData.add(card);
});

events.on('basket-item:delete', (data: { product: ProductCard }) => {
	const { product } = data;
	cartData.remove(product.id);
});

events.on('basket:changed', () => {
	const cardsArray = cartData.cart.map((card, index) => {
		const cardInstance = new ProductCard(
			cloneTemplate(cardBasketTemplate),
			events
		);
		cardInstance.basketIndex = index + 1;
		return cardInstance.render(card);
	});

	counterBasket.textContent = String(cartData.cart.length);

	basket.render({
		catalog: cardsArray,
		totalPrice: cartData.totalPrice,
	});
});

events.on('basketModal:open', () => {
	modalContainer.render({ children: basket.render() });
});

events.on('orderModal:open', () => {
	const { address } = userData.user;
	const inputValues = { address };
	modalContainer.render({ children: order.render({ inputValues }) });
});

events.on('order:submit', (data: IUser) => {
	submitEvent('contactModal:open', data);
});

events.on('order:input', () => {
	validation(order);
});

events.on('contactModal:open', () => {
	const { email, phone } = userData.user;
	const inputValues = { email, phone };
	modalContainer.render({ children: contacts.render({ inputValues }) });
});

events.on('contacts:input', () => {
	validation(contacts);
});

events.on('contacts:submit', (data: IUser) => {
	submitEvent('contactModal:open', data);
	success.totalPrice = cartData.totalPrice;
	modalContainer.render({ children: success.render() });
	cartData.clear();
	userData.clear();
});

events.on('successModal:close', () => {
	modalContainer.close();
});
