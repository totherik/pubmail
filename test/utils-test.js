import test from 'tape'
import Path from 'path';
import { git2http } from '../dist/lib/utils';


test('git2http', function (t) {

    let uris = [
        ['https://github.com/org/repository',           'https://github.com/org/repository'],
        ['https://github.com/org/repository.git',       'https://github.com/org/repository.git'],
        ['git://github.com/org/repository.git',         'https://github.com/org/repository.git'],
        ['git://github.com:org/repository.git',         'https://github.com/org/repository.git'],
        ['git@github.com:org/repository',               'https://github.com/org/repository'],
        ['git@github.com:org/repository.git',           'https://github.com/org/repository.git'],
        ['git@github.com/org/repository',               'https://github.com/org/repository'],
        ['git@github.com/org/repository.git',           'https://github.com/org/repository.git'],
        ['git://git@github.com:org/repository',         'https://github.com/org/repository'],
        ['git://git@github.com:org/repository.git',     'https://github.com/org/repository.git'],
        ['git://git@github.com/org/repository',         'https://github.com/org/repository'],
        ['git://git@github.com/org/repository.git',     'https://github.com/org/repository.git'],
        ['git+ssh://git@github.com:org/repository',     'https://github.com/org/repository'],
        ['git+ssh://git@github.com:org/repository.git', 'https://github.com/org/repository.git'],
        ['git+ssh://git@github.com/org/repository',     'https://github.com/org/repository'],
        ['git+ssh://git@github.com/org/repository.git', 'https://github.com/org/repository.git']
    ];

    t.test('uri', function () {
        //let expected = 'https://github.com/org/repository';

        for (let [uri, expected] of uris) {
            t.equal(git2http(uri), expected);
        }

        t.end();
    });

});