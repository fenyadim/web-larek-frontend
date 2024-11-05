import { Component } from '../components/base/component';

interface ICatalog {
	catalog: HTMLElement[];
}

export class Catalog extends Component<ICatalog> {
	protected _catalog: HTMLElement;

	constructor(protected container: HTMLElement) {
		super(container);
	}

	set catalog(catalog: HTMLElement[]) {
		this.container.replaceChildren(...catalog);
	}
}
