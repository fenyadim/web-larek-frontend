import { Component } from '../components/base/component';
import { IEvents } from '../components/base/events';
import { IUser, TPayment } from '../types';

interface IForm {
	inputValues: Record<string, string>;
	valid: boolean;
	error: Record<string, string>;
}

export class Form extends Component<IForm> {
	protected events: IEvents;
	protected submitButton: HTMLButtonElement;
	protected toggleButtons: NodeListOf<HTMLButtonElement>;
	protected formName: string;
	protected inputs: NodeListOf<HTMLInputElement>;
	protected errors: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this.submitButton = this.container.querySelector('button[type="submit"]');
		this.formName = container.getAttribute('name');
		this.errors = this.container.querySelector('.form__errors');
		this.inputs = this.container.querySelectorAll('.form__input');
		this.toggleButtons = this.container.querySelectorAll('.button_alt');

		container.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit(`${this.formName}:submit`, this.getInputValues());
		});

		this.toggleButtons.forEach((element) => {
			element.addEventListener('click', () => {
				this.toggleMethod(element);
			});
		});

		container.addEventListener('input', (e: InputEvent) => {
			const target = e.target as HTMLInputElement;
			const field = target.name;
			const value = target.value;
			this.events.emit(`${this.formName}:input`, { field, value });
		});
	}

	getInputValues() {
		const valuesObject: Partial<IUser> = {};
		this.inputs.forEach((element) => {
			valuesObject[element.name as keyof Omit<IUser, 'payment'>] =
				element.value;
		});

		if (this.toggleButtons.length) {
			const findCurrentMethod = Array.from(this.toggleButtons).find((item) =>
				item.classList.contains('button_alt-active')
			);

			if (findCurrentMethod) {
				valuesObject.payment = findCurrentMethod.name as TPayment;
			} else {
				valuesObject.payment = '';
			}
		}

		return valuesObject;
	}

	set inputValues(data: Record<string, string>) {
		this.inputs.forEach((element) => {
			element.value = data[element.name];
		});
	}

	set error(data: { validInfo: string }) {
		if (data.validInfo) {
			this.showInputError(data.validInfo);
		} else {
			this.hideInputError();
		}
	}

	protected toggleMethod(button: HTMLButtonElement) {
		this.toggleButtons.forEach((element) => {
			element.classList.remove('button_alt-active');
		});
		button.classList.add('button_alt-active');
		this.events.emit(`${this.formName}:input`, {
			field: 'method',
			value: button.name,
		});
	}

	protected showInputError(errorMessage: string) {
		this.errors.textContent = errorMessage;
	}

	protected hideInputError() {
		this.errors.textContent = '';
	}

	set valid(isValid: boolean) {
		this.submitButton.disabled = !isValid;
	}
}
