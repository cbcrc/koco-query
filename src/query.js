// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import $ from 'jquery';
import jQueryDeparam from 'jquery-deparam';


var Query = function(url, options) {
    var self = this;

    self.options = options || {
        coerce: true
    };
    var xUrl = url || '';

    var urlParts = xUrl.split('?');
    self.__url = urlParts[0];

    self.__query = '';
    self.params = {};

    if (urlParts.length > 1) {
        self.__query = urlParts[1];
    }

    deparam(self);
};

Query.prototype.toString = function() {
    return this.__query;
};

Query.prototype.url = function() {
    var self = this;

    if (Object.keys(self.params).length) {
        return this.__url + '?' + this.__query;
    }

    return this.__url;
};

Query.prototype.setParam = function(name, value) {
    var self = this;

    //todo: handle array value... for

    self.removeParam(name);

    self.__query += (getQueryStringDelimiter(self) + name + '=' + encodeURIComponent(value));

    deparam(self);

    return self;
};

Query.prototype.hasParam = function(name) {
    var self = this;

    return self.params[name] !== undefined;
};

Query.prototype.removeParam = function(paramName) {
    var self = this;

    var prefix = encodeURIComponent(paramName) + '=';
    var pars = self.__query.split(/[&;]/g);

    //reverse iteration as may be destructive
    for (var i = pars.length; i-- > 0;) {
        //idiom for string.startsWith
        if (pars[i].lastIndexOf(prefix, 0) !== -1) {
            pars.splice(i, 1);
        }
    }

    if (pars.length) {
        self.__query = pars.join('&');
    }

    deparam(self);

    return self;
};

function getQueryStringDelimiter(self) {
    if (Object.keys(self.params).length) {
        return '&';
    }

    return '';
}

function deparam(self) {
    if (self.__query) {
        self.params = jQueryDeparam(self.__query, self.options.coerce);
    } else {
        self.params = {};
    }
}

export default Query;
