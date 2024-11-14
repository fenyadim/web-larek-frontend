import { IUser, IUserData } from '../types';
import { IEvents } from './base/events';

export class UserData implements IUserData {
	protected _user: IUser;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
		this._user = {
			phone: '',
			address: '',
			payment: null,
			email: '',
		};
	}

	get user() {
		return this._user;
	}

	update(user: IUser) {
		this._user = {
			...this._user,
			...user,
		};
		this.events.emit('user:changed', this._user);
	}

	clear() {
		this._user = {
			phone: '',
			address: '',
			payment: null,
			email: '',
		};
		this.events.emit('user:changed', this._user);
	}
}
