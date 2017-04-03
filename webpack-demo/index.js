//import _ from 'lodash';
import {
    selectAll
} from "d3-selection";
console.log(selectAll);

function component() {
    var element = document.createElement('div');

    /* lodash is required for the next line to work */
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    return element;
}

document.body.appendChild(component());