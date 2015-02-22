import cool from 'cool-ascii-faces';


export default ({ name, version, description, author = {}, publisher = {}, homepage = 'n/a', repo = 'n/a', changes = '' }) => {

    let { name: authorName = 'anonymous', email: authorEmail = '' } = author;
    let { name: publisherName = 'anonymous', email: publisherEmail = '' } = publisher;

    return `
${name} ${version}
${description}

Author: ${authorName}${authorEmail && ` <${authorEmail}>`}
Publisher: ${publisherName}${publisherEmail && ` <${publisherEmail}>`}
Homepage: ${homepage}
Repository: ${repo}

${changes}

${cool()}`;
};
