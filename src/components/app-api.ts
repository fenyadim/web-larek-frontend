import { ApiListResponse } from '../components/base/api';
import { IApi, IOrder, IProduct } from '../types';

export class AppApi {
	private _baseUrl: IApi;

	constructor(baseApi: IApi) {
		this._baseUrl = baseApi;
	}

	getProducts(): Promise<ApiListResponse<IProduct>> {
		return this._baseUrl
			.get<ApiListResponse<IProduct>>('/product')
			.then((products) => products);
	}

	getOneProduct(id: string): Promise<IProduct> {
		return this._baseUrl
			.get<IProduct>(`/product/${id}`)
			.then((product) => product);
	}

	setOrder(body: IOrder) {
		return this._baseUrl.post('/order', body).then((order) => order);
	}
}
