
// From: https://gist.github.com/zenparsing/5dffde82d9acef19e43c
function dedent(callsite, ...args) {

    function format(str) {
        let size = -1;

        return str.replace(/\n(\s+)/g, (m, m1) => {
            if (size < 0) {
                size = m1.replace(/\t/g, '    ').length;
            }

            return '\n' + m1.slice(Math.min(m1.length, size));
        });
    }

    if (typeof callsite === 'string') {
        return format(callsite);
    }

    if (typeof callsite === 'function') {
        return (...args) => format(callsite(...args));
    }

    let output = callsite
        .slice(0, args.length + 1)
        .map((text, i) => (i === 0 ? '' : args[i - 1]) + text)
        .join('');

    return format(output);
}

export default {

    dedent

};