'use strict';

fakeData();

function Model(options) {
    this.data = options.data;
    this.resource = options.resource;
}

Model.prototype.fetchData = function (id) {
    var _this = this;

    return axios.get('/' + this.resource + 's/' + id).then(function (response) {
        _this.data = response.data;
        return response;
    });
};

Model.prototype.updateData = function (data) {
    var _this2 = this;

    var id = this.data.id;
    return axios.put('/' + this.resource + 's/' + id, data).then(function (response) {
        _this2.data = response.data;
        return response;
    });
};

function View(options) {
    this.element = options.element;
    this.template = options.template;
}

View.prototype.render = function (data) {
    var html = this.template;
    for (var key in data) {
        html = html.replace('__' + key + '__', data[key]);
    }
    $(this.element).html(html);
};

var model = new Model({
    data: {
        name: '',
        number: 1,
        id: ''
    },
    resource: 'book'
});

var view = new View({
    element: '#app',
    template: '\n    <div>\n        <p>\u4E66\u540D:<span class="bookName">\u300A__name__\u300B</span></p>\n        <p>\u6570\u91CF:<span class="bookNumber">__number__</span></p>\n    </div>\n    <div class="actions">\n        <button id="addOne">\u52A01</button>\n        <button id="minusOne">\u51CF1</button>\n        <button id="reset">\u5F52\u96F6</button>\n    </div>\n    '
});

var controller = {
    init: function init(options) {
        var _this3 = this;

        this.view = options.view;
        this.model = options.model;
        this.view.render(this.model.data);
        this.bindEvents();
        this.model.fetchData(1).then(function () {
            _this3.view.render(_this3.model.data);
        });
    },
    addOne: function addOne() {
        var _this4 = this;

        var oldValue = $(".bookNumber").text() - 0;
        var newValue = oldValue + 1;
        this.model.updateData({
            number: newValue,
            id: "1"
        }).then(function () {
            _this4.view.render(_this4.model.data);
        });
    },
    minusOne: function minusOne() {
        var _this5 = this;

        var oldValue = $(".bookNumber").text() - 0;
        var newValue = oldValue - 1;
        this.model.updateData({
            number: newValue,
            id: "1"
        }).then(function () {
            _this5.view.render(_this5.model.data);
        });
    },
    reset: function reset() {
        var _this6 = this;

        this.model.updateData({
            number: 0,
            id: "1"
        }).then(function () {
            _this6.view.render(_this6.model.data);
        });
    },
    bindEvents: function bindEvents() {
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
    var book = {
        name: "Javascript高级程序设计",
        number: 1,
        id: '1'
    };
    return axios.interceptors.response.use(function (response) {
        var _response$config = response.config,
            url = _response$config.url,
            method = _response$config.method,
            data = _response$config.data; // 这里的data是response返回的data

        if (url === "/books/1" && method === "get") {
            response.data = book;
        } else if (url === "/books/1" && method === "put") {
            data = JSON.parse(data);
            data = Object.assign(book, data);
            response.data = data;
        }
        return response;
    });
}