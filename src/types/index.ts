export interface IProduct {
	id: string;
	title: string;
	price: number;
	image: string;
	category: string;
	description: string;
}

export interface IUser {
	method: 'card' | 'cash';
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
	addToCart: (product: IProduct) => void;
	removeFromCart: (productId: string) => void;
	clearCart: () => void;
}

export interface IUserData {
	user: IUser;
	updateUserInfo: (user: IUser) => void;
}

export type TProductCatalog = Omit<IProduct, 'description'>;
export type TProductCart = Pick<IProduct, 'id' | 'title' | 'price'>;
