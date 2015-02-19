import { dedent } from './utils'


export default ({ name, version, description, author = {}, publisher = {}, homepage = 'n/a', repository = 'Not found.' }) => {

    let { name: authorName = 'anonymous', email: authorEmail = '' } = author;
    let { name: publisherName = 'anonymous', email: publisherEmail = '' } = publisher;

    return dedent`
        Module: ${name}
        Version: ${version}
        Author: ${authorName}${authorEmail && ` <${authorEmail}>`}
        Published By: ${publisherName}${publisherEmail && ` <${publisherEmail}>`}
        Homepage: ${homepage}
        Repository: ${repository}
        Description: ${description}
    `;
}