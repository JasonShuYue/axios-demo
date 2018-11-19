
fakeData();


function Model(options) {
    this.data = options.data;
    this.resource = options.resource;
}

Model.prototype.fetchData = function(id) {
    return axios.get(`/${this.resource}s/${id}`)
        .then((response) => {
            this.data = response.data;
            return response;
        });
};


Model.prototype.updateData = function(data) {
    let id = this.data.id;
    return axios.put(`/${this.resource}s/${id}`, data)
        .then((response) => {
            this.data = response.data;
            return response;
        });
};



function View(options) {
    this.element = options.element;
    this.template = options.template;
}

View.prototype.render = function(data) {
    let html = this.template;
    for(let key in data) {
        html = html.replace(`__${key}__`, data[key]);
    }
    $(this.element).html(html);
};

let model = new Model({
    data: {
        name: '',
        number: 1,
        id: ''
    },
    resource: 'book'
});

let view = new View({
    element: '#app',
    template: `
    <div>
        <p>书名:<span class="bookName">《__name__》</span></p>
        <p>数量:<span class="bookNumber">__number__</span></p>
    </div>
    <div class="actions">
        <button id="addOne">加1</button>
        <button id="minusOne">减1</button>
        <button id="reset">归零</button>
    </div>
    `,
});

var controller = {
    init: function(options) {
        this.view = options.view;
        this.model = options.model;
        this.view.render(this.model.data);
        this.bindEvents();
        this.model.fetchData(1)
            .then(() => {
                this.view.render(this.model.data);
            });
    },
    addOne() {
        let oldValue = $(".bookNumber").text() - 0;
        let newValue = oldValue + 1;
        this.model.updateData({
            number: newValue,
            id: "1"
        }).then(() => {
            this.view.render(this.model.data);
        });
    },
    minusOne() {
        let oldValue = $(".bookNumber").text() - 0;
        let newValue = oldValue - 1;
        this.model.updateData({
            number: newValue,
            id: "1"
        }).then(() => {
            this.view.render(this.model.data);
        });
    },
    reset() {
        this.model.updateData({
            number: 0,
            id: "1"
        }).then(() => {
            this.view.render(this.model.data);
        });
    },
    bindEvents() {
        $(this.view.element).on("click", "#addOne", this.addOne.bind(this));
        $(this.view.element).on("click", "#minusOne", this.minusOne.bind(this));
        $(this.view.element).on("click", "#reset", this.reset.bind(this));


    }
};

controller.init({
    view: view,
    model: model
});





function fakeData() {
    //  在真正返回response前，将它拦截下来进行改写。
    let book = {
        name: "Javascript高级程序设计",
        number: 1,
        id: '1'
    };
    return axios.interceptors.response.use(function(response) {
        let {config: {url, method, data}} = response;   // 这里的data是response返回的data
        if(url === "/books/1" && method === "get") {
            response.data = book;
        } else if(url === "/books/1" && method === "put") {
            data = JSON.parse(data);
            data = Object.assign(book, data);
            response.data = data;
        }
        return response;
    });
}