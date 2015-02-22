import Semver from 'semver';
import Nodemailer from 'nodemailer';
import template from './template';
import { git2http, compare } from './utils';


export default class Mailer {

    constructor(options = {}) {
        let { host, port = 25, sender, recipient } = options;

        this.transport = Nodemailer.createTransport({ host, port });
        this.message = {
            from: sender,
            to: recipient
        };
    }

    send(pkg, cb) {
        let { id: name, doc } = pkg;
        let { 'dist-tags': { latest: version } } = doc;
        let {
            homepage,
            repository = { },
            description,
            author,
            _npmUser: publisher,
            gitHead: currentGitHead
        } = doc.versions[version];

        // Generate link to changes since last publish.
        let changes = undefined;
        let { url: repo = 'n/a' } = repository;

        // Hamfisted way of ensuring the repo is a GitHub repo so that we generate
        // correct links. These links wouldn't make sense outside GitHub anyway.
        if (repository.type === 'git' && repo.indexOf('github') !== -1 && currentGitHead) {
            // Do our best to convert the provided URL to an SSL git checkout URL.
            repo = git2http(repo);
            if (typeof repo === 'string') {
                // Remove the extension to (hopefully) derive a GitHub URL.
                repo = repo.replace(/\.git$/, '');

                // Grab the keys of all published versions and sort using a
                // semver comparator. The result *should* be a correctly ordered
                // version array, from which we can grab the previous version. It
                // may not make sense to grab versions across major release boundaries,
                // but this can be fine-tuned in the future, if necessary.
                let versions = Object.keys(doc.versions).sort(Semver.compare);
                let previous = versions[versions.indexOf(version) - 1];
                let { gitHead: previousGitHead } = (doc.versions[previous] || {});

                if (previousGitHead && previousGitHead !== currentGitHead) {
                    changes = `${repo}/compare/${previousGitHead}...${currentGitHead}`;
                } else {
                    changes = `${repo}/commit/${currentGitHead}`;
                }
            }
        }

        let message = Object.assign({
            subject: `npm publish ${name}@${version}`,
            text: template({ name, version, homepage, repo, description, author, publisher, changes  })
        }, this.message);

        this.transport.sendMail(message, cb);
    }

}