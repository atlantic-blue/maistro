import AWS from 'aws-sdk';

interface SendEmailInput {
    to: string[]
    cc?: string[]
    bcc?: string[]
    from: string
    subject: string
    body: string
}

const ses = new AWS.SES();

const sendEmail = async ({
    to, cc, bcc, from, subject, body
}: SendEmailInput) => {
    const params: AWS.SES.SendEmailRequest = {
        Destination: {
            ToAddresses: to,
            CcAddresses: cc,
            BccAddresses: bcc,
        },
        Source: from,

        Message: {
            Subject: {
                Data: subject,
            },
            Body: {
                Html: {
                    Data: body,
                }
            }
        }
    }

    return await ses.sendEmail(params).promise();
}

export default sendEmail