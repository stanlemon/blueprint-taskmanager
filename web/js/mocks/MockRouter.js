export default function MockRouter() {
    this.routes = [];

    this.push = route => {
        this.routes.push(route);
    };
}
