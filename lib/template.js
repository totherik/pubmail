import cool from 'cool-ascii-faces';


export default ({ name, version, description, author = {}, publisher = {}, homepage = 'Not set.', repo = 'Not set.', changes = '' }) => {

    let { name: authorName = 'anonymous', email: authorEmail = '' } = author;
    let { name: publisherName = 'anonymous', email: publisherEmail = '' } = publisher;

    return `
${name} ${version}
${description}

Author: ${authorName}${authorEmail && ` <${authorEmail}>`}
Publisher: ${publisherName}${publisherEmail && ` <${publisherEmail}>`}
Homepage: ${homepage}
Repository: ${repo}
${changes ? `\n${changes}\n` : ''}
${cool()}`;
};
