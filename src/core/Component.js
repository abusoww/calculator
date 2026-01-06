export class Component {
    constructor(hostElement, props = {}) {
        this.host = hostElement;
        this.props = props;
        this.init();
    }

    init() {
        this.render();
    }

    update(newProps = {}) {
        this.props = { ...this.props, ...newProps };
        this.render();
    }

    render() {
        this.host.innerHTML = this.template();
        this.afterRender();
    }

    template() {
        return '';
    }

    afterRender() { }
}
