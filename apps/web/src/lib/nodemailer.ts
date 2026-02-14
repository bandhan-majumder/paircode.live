import { commonMailSchema, type commonMailSchemaType } from '@/types/common-email.type'
import nodemailer from 'nodemailer'
import { env } from '@paircode/env/web';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: env.USER_EMAIL || '',
        pass: env.USER_EMAIL_PASS || '',
    },
})

async function sendEmail({
    receiverEmail,
    senderName,
    subject,
    body,
}: commonMailSchemaType): Promise<void> {
    const parsedData = commonMailSchema.safeParse({
        receiverEmail,
        senderName,
        subject,
        body,
    })

    if (!parsedData.success) {
        console.error('Invalid feedback form data:', parsedData.error)
        return
    };

    try {
        await transporter.sendMail({
            from: `<${env.USER_EMAIL_ALIAS || env.USER_EMAIL || ''}>`,
            to: [receiverEmail || env.RECIPIENT_EMAIL || ''],
            subject,
            text: body,
        })
    } catch (error) {
        console.error('Error sending email:', error)
    }
}

export { sendEmail }