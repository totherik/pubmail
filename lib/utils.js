import Url from 'url';
import Semver from 'semver';


function gitHeads(version, versions) {
    if (!(version in versions)) {
        return;
    }

    // Grab the keys of all published versions and sort using a
    // semver comparator. The result *should* be a correctly ordered
    // version array, from which we can grab the previous version. It
    // may not make sense to grab versions across major release boundaries,
    // but this can be fine-tuned in the future, if necessary.
    let keys = Object.keys(versions).sort(Semver.compare);
    let previous = keys[keys.indexOf(version) - 1];

    let { gitHead: currentGitHead } = versions[version];
    let { gitHead: previousGitHead } = (versions[previous] || {});

    return { previousGitHead, currentGitHead };
}


function link2diff(repository = {}, gitHead = {}) {
    let changes;

    let { type = '', url = '' } = repository;
    if (type !== 'git' || url.indexOf('github') === -1) {
        // Hamfisted way of ensuring the repo is a GitHub repo so that we generate
        // correct links. These links wouldn't make sense outside GitHub anyway.
        return undefined;
    }

    let { currentGitHead, previousGitHead } = gitHead;
    if (currentGitHead) {
        // Do our best to convert the provided URL to an SSL git checkout URL.
        url = git2http(url);

        if (typeof url === 'string') {
            // Remove the extension to (hopefully) derive a GitHub URL.
            url = url.replace(/\.git$/, '');

            if (previousGitHead && previousGitHead !== currentGitHead) {
                changes = `${url}/compare/${previousGitHead}...${currentGitHead}`;
            } else {
                changes = `${url}/commit/${currentGitHead}`;
            }
        }
    }

    return changes;
}


function git2http(url) {
    // Discard non-strings
    if (typeof url !== 'string') {
        return undefined;
    }

    // Try parsing the URL, if that fails one symptom is
    // a missing protocol. If the protocol is missing,
    // prepend one and try again. That way we don't have to
    // try to write url parsing rules here, we just test
    // for what we need.
    let parsed = Url.parse(url);
    if (!parsed.protocol && !parsed.hostname) {
        // If there's no protocol, we assume the parse failed. Will
        // happen, for example, on git@github.com:org/repository.git.
        parsed = Url.parse('https://' + url);
        if (!parsed.protocol && !parsed.hostname) {
            // Adding a protocol didn't help, so not a valid uri for our needs.
            return undefined;
        }
    }

    // Git paths like github.com:org/repo produce the pathname
    // '/:org/repo', so the colon needs to be removed. Also,
    // remove the optional `.git` extension.
    parsed.pathname = parsed.pathname.replace(/^\/\:/, '/');
    parsed.protocol = 'https:';
    parsed.slashes = true;
    parsed.auth = null;
    parsed.host = null;
    parsed.path = null;
    parsed.search = null;
    parsed.hash = null;
    parsed.query = null;
    return Url.format(parsed);
}


export default {

    gitHeads,

    git2http,

    link2diff

};