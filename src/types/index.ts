import { ApiPostMethods } from '../components/base/api';

export interface IProduct {
	id: string;
	title: string;
	price: number | null;
	image: string;
	category: string;
	description: string;
}

export type TPayment = 'card' | 'cash';

export interface IUser {
	payment: TPayment | '';
	address: string;
	email: string;
	phone: string;
}

export interface IProductsData {
	products: IProduct[];
	getOneProduct: (id: string) => IProduct;
}

export interface ICartData {
	cart: TProductCart[];
	totalPrice: number;
	add: (product: IProduct) => void;
	remove: (productId: string) => void;
	clear: () => void;
}

export interface IUserData {
	user: IUser;
	update: (user: IUser) => void;
	clear: () => void;
}

export interface IOrder extends IUser {
	total: number;
	items: string[];
}

export type TProductCatalog = Omit<IProduct, 'description'>;
export type TProductCart = Pick<IProduct, 'id' | 'title' | 'price'>;

export interface IApi {
	baseUrl: string;
	get<T>(url: string): Promise<T>;
	post<T>(url: string, data: object, method?: ApiPostMethods): Promise<T>;
}
